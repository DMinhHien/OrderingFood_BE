import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RestaurantCategory } from './restaurant-category.model';
import { CreateRestaurantCategoryDto } from './dto/create-restaurant-category.dto';
import { UpdateRestaurantCategoryDto } from './dto/update-restaurant-category.dto';

@Injectable()
export class RestaurantCategoryService {
  constructor(
    @InjectModel(RestaurantCategory)
    private readonly restaurantCategoryModel: typeof RestaurantCategory,
  ) {}

  async create(
    createRestaurantCategoryDto: CreateRestaurantCategoryDto,
  ): Promise<RestaurantCategory> {
    return this.restaurantCategoryModel.create({
      ...createRestaurantCategoryDto,
      isActive: createRestaurantCategoryDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<RestaurantCategory[]> {
    return this.restaurantCategoryModel.findAll({
      where: { isActive: true },
    });
  }

  async findOne(id: number): Promise<RestaurantCategory> {
    const category = await this.restaurantCategoryModel.findOne({
      where: { id, isActive: true },
    });

    if (!category) {
      throw new NotFoundException(
        `Restaurant category với ID ${id} không tồn tại`,
      );
    }

    return category;
  }

  async update(
    id: number,
    updateRestaurantCategoryDto: UpdateRestaurantCategoryDto,
  ): Promise<RestaurantCategory> {
    const category = await this.findOne(id);
    await category.update(updateRestaurantCategoryDto);
    return category.reload();
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await category.update({ isActive: false });
  }
}
