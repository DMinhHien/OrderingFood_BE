import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderJourney } from './order-journey.model';
import { CreateOrderJourneyDto } from './dto/create-order-journey.dto';
import { UpdateOrderJourneyDto } from './dto/update-order-journey.dto';

@Injectable()
export class OrderJourneyService {
  constructor(
    @InjectModel(OrderJourney)
    private journeyModel: typeof OrderJourney,
  ) {}

  async create(dto: CreateOrderJourneyDto): Promise<OrderJourney> {
    // Map longtitude (from DTO) to longitude (model property)
    const createData: any = {
      ...dto,
      longitude: dto.longtitude,
    };
    delete createData.longtitude;
    return this.journeyModel.create(createData);
  }

  async findByOrder(orderId: number): Promise<OrderJourney[]> {
    return this.journeyModel.findAll({
      where: { orderId, isActive: true },
      order: [
        ['timeline', 'ASC'],
        ['createdAt', 'ASC'],
      ],
    });
  }

  async findOne(id: number): Promise<OrderJourney> {
    const item = await this.journeyModel.findByPk(id);
    if (!item) {
      throw new NotFoundException(`OrderJourney with ID ${id} not found`);
    }
    return item;
  }

  async update(id: number, dto: UpdateOrderJourneyDto): Promise<OrderJourney> {
    const item = await this.findOne(id);
    // Map longtitude (from DTO) to longitude (model property)
    const updateData: any = { ...dto };
    if (dto.longtitude !== undefined) {
      updateData.longitude = dto.longtitude;
      delete updateData.longtitude;
    }
    return item.update(updateData);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await item.destroy();
  }
}
