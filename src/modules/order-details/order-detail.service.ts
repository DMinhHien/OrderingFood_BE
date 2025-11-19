import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderDetail } from './order-detail.model';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectModel(OrderDetail)
    private orderDetailModel: typeof OrderDetail,
  ) {}

  async create(
    createOrderDetailDto: CreateOrderDetailDto,
  ): Promise<OrderDetail> {
    return this.orderDetailModel.create({
      ...createOrderDetailDto,
      isActive: createOrderDetailDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<OrderDetail[]> {
    return this.orderDetailModel.findAll({
      where: { isActive: true },
      include: ['product', 'order'],
    });
  }

  async findOne(id: number): Promise<OrderDetail> {
    const orderDetail = await this.orderDetailModel.findOne({
      where: { id, isActive: true },
      include: ['product', 'order'],
    });

    if (!orderDetail) {
      throw new NotFoundException(`OrderDetail with ID ${id} not found`);
    }

    return orderDetail;
  }

  async update(
    id: number,
    updateOrderDetailDto: UpdateOrderDetailDto,
  ): Promise<OrderDetail> {
    const orderDetail = await this.findOne(id);
    await orderDetail.update(updateOrderDetailDto);
    return orderDetail.reload();
  }

  async remove(id: number): Promise<void> {
    const orderDetail = await this.findOne(id);
    await orderDetail.update({ isActive: false });
  }
}
