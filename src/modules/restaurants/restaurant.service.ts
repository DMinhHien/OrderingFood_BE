import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Restaurant } from './restaurant.model';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant)
    private restaurantModel: typeof Restaurant,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    return this.restaurantModel.create({
      ...createRestaurantDto,
      isActive: createRestaurantDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantModel.findAll({
      where: { isActive: true },
      include: ['category', 'user', 'address'],
    });
  }

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findOne({
      where: { id, isActive: true },
      include: ['category', 'user', 'address'],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return restaurant;
  }

  async update(
    id: number,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    await restaurant.update(updateRestaurantDto);
    return restaurant.reload();
  }

  async remove(id: number): Promise<void> {
    const restaurant = await this.findOne(id);
    await restaurant.update({ isActive: false });
  }
}
