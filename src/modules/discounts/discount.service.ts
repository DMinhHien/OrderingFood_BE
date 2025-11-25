import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Discount } from './discount.model';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount)
    private discountModel: typeof Discount,
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    return this.discountModel.create({
      ...createDiscountDto,
      startTime: createDiscountDto.startTime
        ? new Date(createDiscountDto.startTime)
        : undefined,
      endTime: createDiscountDto.endTime
        ? new Date(createDiscountDto.endTime)
        : undefined,
      isActive: createDiscountDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<Discount[]> {
    return this.discountModel.findAll({
      where: { isActive: true },
    });
  }

  async findOne(id: number): Promise<Discount> {
    const discount = await this.discountModel.findOne({
      where: { id, isActive: true },
    });

    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }

    return discount;
  }

  async update(
    id: number,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discount> {
    const discount = await this.findOne(id);
    const { startTime, endTime, ...rest } =
      updateDiscountDto as UpdateDiscountDto & {
        startTime?: string;
        endTime?: string;
      };

    const updateData: Partial<Discount> = {
      ...rest,
    } as Partial<Discount>;

    if (startTime) {
      updateData.startTime = new Date(startTime);
    }

    if (endTime) {
      updateData.endTime = new Date(endTime);
    }

    await discount.update(updateData);
    return discount.reload();
  }

  async remove(id: number): Promise<void> {
    const discount = await this.findOne(id);
    await discount.update({ isActive: false });
  }
}
