import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.model';
import { Notification } from '../notifications/notification.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderModel.create({
      ...createOrderDto,
      isActive: createOrderDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.findAll({
      where: { isActive: true },
      include: ['user', 'restaurant', 'address', 'discount'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderModel.findOne({
      where: { id, isActive: true },
      include: [
        'user',
        'restaurant',
        'address',
        'discount',
        {
          association: 'orderDetails',
          include: ['product'],
        },
        'payments',
        {
          association: 'feedbacks',
          include: [
            {
              association: 'responses',
              include: ['sender'],
            },
          ],
        },
      ],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByUser(userId: number, status?: number): Promise<Order[]> {
    const where: any = { userId, isActive: true };

    if (status) {
      where.status = status;
    }

    return this.orderModel.findAll({
      where,
      include: [
        {
          association: 'restaurant',
        },
        {
          association: 'orderDetails',
          include: ['product'],
        },
        'discount',
        {
          association: 'feedbacks',
          include: [
            {
              association: 'responses',
              include: ['sender'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByRestaurant(
    restaurantId: number,
    status?: number,
  ): Promise<Order[]> {
    const where: any = { restaurantId, isActive: true };

    if (status) {
      where.status = status;
    }

    return this.orderModel.findAll({
      where,
      include: [
        {
          association: 'user',
        },
        {
          association: 'address',
        },
        {
          association: 'orderDetails',
          include: ['product'],
        },
        'discount',
        {
          association: 'feedbacks',
          include: [
            {
              association: 'responses',
              include: ['sender'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    const previousStatus = order.status;

    await order.update(updateOrderDto);

    const normalizedStatus =
      typeof updateOrderDto.status === 'string'
        ? Number(updateOrderDto.status)
        : updateOrderDto.status;

    const statusChanged =
      typeof normalizedStatus === 'number' &&
      !Number.isNaN(normalizedStatus) &&
      normalizedStatus !== previousStatus;

    if (statusChanged) {
      this.logger.log(
        `Order #${order.id} status changed from ${previousStatus} to ${normalizedStatus}`,
      );
      await this.createStatusNotification(order, normalizedStatus);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await order.update({ isActive: false });
  }

  private async createStatusNotification(order: Order, newStatus: number) {
    const [restaurant, customer] = await Promise.all([
      order.restaurant
        ? Promise.resolve(order.restaurant)
        : order.$get('restaurant'),
      order.user ? Promise.resolve(order.user) : order.$get('user'),
    ]);

    const senderId =
      restaurant?.getDataValue('userId') ?? (restaurant as any)?.userId ?? null;
    const receivedId =
      customer?.getDataValue('id') ?? customer?.id ?? order.userId ?? null;

    if (!senderId || !receivedId) {
      this.logger.warn(
        `Skip notification for order #${order.id}: senderId=${senderId}, receivedId=${receivedId}`,
      );
      return;
    }

    const statusLabel = this.getOrderStatusLabel(newStatus);
    const content = `Đơn hàng #${order.id} của bạn đã được cập nhật trạng thái mới sang "${statusLabel}".`;

    await this.notificationModel.create({
      content,
      type: 1,
      sentId: senderId,
      receivedId,
      orderId: order.id,
      isRead: false,
      isActive: true,
    } as any);

    this.logger.log(
      `Created notification for order #${order.id} to receiver ${receivedId}`,
    );
  }

  private getOrderStatusLabel(status: number): string {
    const STATUS_LABELS: Record<number, string> = {
      1: 'Đang xử lý',
      2: 'Đã xác nhận',
      3: 'Đang giao',
      4: 'Hoàn thành',
      5: 'Đã hủy',
    };

    return STATUS_LABELS[status] || `Trạng thái ${status}`;
  }
}
