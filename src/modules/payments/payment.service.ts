import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './payment.model';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentModel.create({
      ...createPaymentDto,
      isActive: createPaymentDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.findAll({
      where: { isActive: true },
      include: ['order'],
    });
  }

  async findByOrder(orderId: number): Promise<Payment[]> {
    return this.paymentModel.findAll({
      where: { orderId, isActive: true },
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentModel.findOne({
      where: { id, isActive: true },
      include: ['order'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id);
    await payment.update(updatePaymentDto);
    return payment.reload();
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    await payment.update({ isActive: false });
  }

  /**
   * Webhook Zalopay: khi thanh toán thành công, cập nhật payment.status = 2 cho payment mới nhất của order
   * Giả định payload chứa orderId (hoặc note có số orderId).
   */
  // Webhook Zalopay đã được gỡ bỏ theo yêu cầu; giữ comment để tham chiếu nếu cần bật lại trong tương lai.
}
