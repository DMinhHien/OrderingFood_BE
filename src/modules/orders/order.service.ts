import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.model';
import { Notification } from '../notifications/notification.model';
import { OrderDetail } from '../order-details/order-detail.model';
import { Payment } from '../payments/payment.model';
import { Product } from '../products/product.model';
import { Discount } from '../discounts/discount.model';
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
    @InjectModel(OrderDetail)
    private orderDetailModel: typeof OrderDetail,
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(Discount)
    private discountModel: typeof Discount,
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
          association: 'payments',
        },
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
          association: 'payments',
        },
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

    this.logger.log(
      `Updating order #${id} - has orderDetails: ${!!updateOrderDto.orderDetails}, has payment: ${!!updateOrderDto.payment}`,
    );

    // Extract orderDetails and payment from DTO
    const { orderDetails, payment, ...orderUpdateData } = updateOrderDto;

    // Update order fields (note, addressId, discountId, status, etc.)
    await order.update(orderUpdateData);

    // Handle orderDetails update
    let orderDetailsUpdated = false;
    if (orderDetails && Array.isArray(orderDetails)) {
      orderDetailsUpdated = true;
      // Get existing order details
      const existingDetails = await this.orderDetailModel.findAll({
        where: { orderId: id, isActive: true },
      });

      const existingDetailIds = existingDetails.map((d) => d.id);
      const incomingDetailIds = orderDetails
        .map((d) => d.id)
        .filter((id) => id !== undefined && id !== null);

      // Delete order details that are not in the new list
      const toDelete = existingDetails.filter(
        (d) => !incomingDetailIds.includes(d.id),
      );
      for (const detail of toDelete) {
        await detail.update({ isActive: false });
      }

      // Update or create order details
      for (const detailDto of orderDetails) {
        if (detailDto.id && existingDetailIds.includes(detailDto.id)) {
          // Update existing detail
          const existingDetail = existingDetails.find(
            (d) => d.id === detailDto.id,
          );
          if (existingDetail) {
            await existingDetail.update({
              quantity: detailDto.quantity,
              note: detailDto.note,
              productId: detailDto.productId,
            });
          }
        } else if (detailDto.productId && detailDto.quantity) {
          // Create new detail
          await this.orderDetailModel.create({
            orderId: id,
            productId: detailDto.productId,
            quantity: detailDto.quantity,
            note: detailDto.note,
            isActive: true,
          } as any);
        }
      }
    }

    // Handle payment update
    if (payment) {
      // Get existing payment for this order
      const existingPayment = await this.paymentModel.findOne({
        where: { orderId: id, isActive: true },
      });

      if (existingPayment) {
        // Update existing payment
        await existingPayment.update({
          paymentMethod: payment.paymentMethod,
          status: payment.status ?? existingPayment.status,
        });
      } else if (payment.paymentMethod) {
        // Create new payment
        await this.paymentModel.create({
          orderId: id,
          paymentMethod: payment.paymentMethod,
          status: payment.status ?? 1, // Default status: pending
          isActive: true,
        } as any);
      }
    }

    // ALWAYS recalculate totalPrice if orderDetails were provided in DTO
    // This ensures totalPrice is always accurate after orderDetails update
    if (orderDetails && Array.isArray(orderDetails)) {
      // Wait a bit to ensure all orderDetails updates are committed to DB
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Get current orderDetails from DB (after update)
      const currentDetails = await this.orderDetailModel.findAll({
        where: { orderId: id, isActive: true },
        attributes: ['id', 'productId', 'quantity', 'isActive'], // Explicitly select fields
        raw: false, // Get Sequelize instances
      });

      this.logger.log(
        `[TOTAL_PRICE] Recalculating totalPrice for order #${id}, found ${currentDetails.length} active order details`,
      );

      if (currentDetails.length === 0) {
        this.logger.warn(
          `[TOTAL_PRICE] Order #${id} has no active orderDetails, setting totalPrice to 0`,
        );
        await order.update({ totalPrice: 0 });
      } else {
        let newTotalPrice = 0;

        // Calculate totalPrice from current orderDetails in DB
        for (const detail of currentDetails) {
          // Try multiple ways to get productId and quantity
          let productId: number | undefined;
          let quantity: number = 0;

          // Method 1: Direct property access
          if (typeof (detail as any).productId === 'number') {
            productId = (detail as any).productId;
          }
          // Method 2: dataValues
          else if (
            (detail as any).dataValues &&
            typeof (detail as any).dataValues.productId === 'number'
          ) {
            productId = (detail as any).dataValues.productId;
          }
          // Method 3: getDataValue
          else if (typeof (detail as any).getDataValue === 'function') {
            productId = (detail as any).getDataValue('productId');
          }

          // Get quantity
          if (typeof (detail as any).quantity === 'number') {
            quantity = (detail as any).quantity;
          } else if (
            (detail as any).dataValues &&
            typeof (detail as any).dataValues.quantity === 'number'
          ) {
            quantity = (detail as any).dataValues.quantity;
          } else if (typeof (detail as any).getDataValue === 'function') {
            quantity = (detail as any).getDataValue('quantity') || 0;
          }

          this.logger.log(
            `[TOTAL_PRICE] Processing orderDetail #${detail.id}: productId=${productId}, quantity=${quantity}`,
          );
          this.logger.log(
            `[TOTAL_PRICE] OrderDetail object: ${JSON.stringify({
              id: detail.id,
              hasProductId: !!(detail as any).productId,
              hasDataValues: !!(detail as any).dataValues,
              dataValues: (detail as any).dataValues
                ? {
                    productId: (detail as any).dataValues.productId,
                    quantity: (detail as any).dataValues.quantity,
                  }
                : null,
            })}`,
          );

          if (!productId || !quantity || quantity <= 0) {
            this.logger.warn(
              `[TOTAL_PRICE] Skipping orderDetail #${detail.id}: missing productId or invalid quantity`,
            );
            continue;
          }

          // Get product directly from Product model
          const product = await this.productModel.findByPk(productId, {
            attributes: ['id', 'name', 'price'],
            raw: false, // Ensure we get a Sequelize instance
          });

          if (product) {
            // Try multiple ways to get price
            let productPrice = 0;
            if (typeof (product as any).price === 'number') {
              productPrice = (product as any).price;
            } else if (
              (product as any).dataValues &&
              typeof (product as any).dataValues.price === 'number'
            ) {
              productPrice = (product as any).dataValues.price;
            } else if (typeof (product as any).getDataValue === 'function') {
              productPrice = (product as any).getDataValue('price') || 0;
            } else if (
              (product as any).toJSON &&
              typeof (product as any).toJSON().price === 'number'
            ) {
              productPrice = (product as any).toJSON().price;
            }

            this.logger.log(
              `[TOTAL_PRICE] Product #${productId} found: name="${(product as any).name || 'N/A'}", price=${productPrice}`,
            );

            if (productPrice > 0 && typeof productPrice === 'number') {
              const detailTotal = productPrice * quantity;
              newTotalPrice += detailTotal;
              this.logger.log(
                `[TOTAL_PRICE] ✓ OrderDetail #${detail.id}: productId=${productId}, product price=${productPrice}, quantity=${quantity}, subtotal=${detailTotal}`,
              );
            } else {
              this.logger.error(
                `[TOTAL_PRICE] ✗ OrderDetail #${detail.id}: product price is invalid (${productPrice}) for productId=${productId}`,
              );
            }
          } else {
            this.logger.error(
              `[TOTAL_PRICE] OrderDetail #${detail.id}: product not found for productId=${productId}`,
            );
          }
        }

        this.logger.log(
          `[TOTAL_PRICE] Calculated subtotal before discount: ${newTotalPrice}`,
        );

        // Apply discount if exists (use discountId from DTO or existing order)
        let discountPercent = 0;
        const finalDiscountId =
          updateOrderDto.discountId !== undefined
            ? updateOrderDto.discountId
            : order.discountId;

        if (finalDiscountId) {
          const discount = await this.discountModel.findByPk(finalDiscountId, {
            attributes: ['id', 'percent'],
          });
          if (discount) {
            discountPercent =
              (discount as any).percent ||
              (discount as any).dataValues?.percent ||
              (discount as any).getDataValue?.('percent') ||
              0;
          }
        }

        if (discountPercent > 0) {
          const discountAmount = (newTotalPrice * discountPercent) / 100;
          newTotalPrice = newTotalPrice - discountAmount;
          this.logger.log(
            `[TOTAL_PRICE] Applied discount: ${discountPercent}%, discount amount: ${discountAmount}, final total: ${newTotalPrice}`,
          );
        }

        const finalTotalPrice = Math.round(newTotalPrice);
        this.logger.log(
          `[TOTAL_PRICE] Final totalPrice for order #${id}: ${finalTotalPrice} (was ${order.totalPrice || 0})`,
        );

        // Update totalPrice using direct SQL update to ensure it's saved
        await this.orderModel.update(
          { totalPrice: finalTotalPrice },
          { where: { id } },
        );

        // Reload order to verify
        const updatedOrder = await this.orderModel.findByPk(id, {
          attributes: ['id', 'totalPrice'],
        });

        const savedTotalPrice =
          (updatedOrder as any)?.totalPrice ||
          (updatedOrder as any)?.dataValues?.totalPrice ||
          (updatedOrder as any)?.getDataValue?.('totalPrice') ||
          0;

        this.logger.log(
          `[TOTAL_PRICE] Order #${id} updated. New totalPrice in DB: ${savedTotalPrice}`,
        );
      }
    } else {
      this.logger.log(
        `[TOTAL_PRICE] Skipping totalPrice recalculation for order #${id}: no orderDetails in DTO`,
      );
    }

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
