import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
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
      include: ['user', 'restaurant', 'address', 'discount'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    await order.update(updateOrderDto);
    return order.reload();
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await order.update({ isActive: false });
  }
}
