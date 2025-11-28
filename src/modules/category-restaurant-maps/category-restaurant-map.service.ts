import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryRestaurantMap } from './category-restaurant-map.model';
import { CreateCategoryRestaurantMapDto } from './dto/create-category-restaurant-map.dto';
import { UpdateCategoryRestaurantMapDto } from './dto/update-category-restaurant-map.dto';

@Injectable()
export class CategoryRestaurantMapService {
  constructor(
    @InjectModel(CategoryRestaurantMap)
    private readonly categoryRestaurantMapModel: typeof CategoryRestaurantMap,
  ) {}

  async create(
    createCategoryRestaurantMapDto: CreateCategoryRestaurantMapDto,
  ): Promise<CategoryRestaurantMap> {
    return this.categoryRestaurantMapModel.create({
      ...createCategoryRestaurantMapDto,
      isActive: createCategoryRestaurantMapDto.isActive ?? true,
    } as CategoryRestaurantMap);
  }

  async findAll(): Promise<CategoryRestaurantMap[]> {
    return this.categoryRestaurantMapModel.findAll({
      include: ['restaurant', 'category'],
    });
  }

  async findOne(id: number): Promise<CategoryRestaurantMap> {
    const link = await this.categoryRestaurantMapModel.findByPk(id, {
      include: ['restaurant', 'category'],
    });

    if (!link) {
      throw new NotFoundException(
        `Liên kết nhà hàng - danh mục với ID ${id} không tồn tại`,
      );
    }

    return link;
  }

  async update(
    id: number,
    updateCategoryRestaurantMapDto: UpdateCategoryRestaurantMapDto,
  ): Promise<CategoryRestaurantMap> {
    const link = await this.findOne(id);
    await link.update(updateCategoryRestaurantMapDto);
    return link.reload();
  }

  async remove(id: number): Promise<void> {
    const link = await this.findOne(id);
    await link.update({ isActive: false });
  }

  async findByRestaurant(
    restaurantId: number,
  ): Promise<CategoryRestaurantMap[]> {
    return this.categoryRestaurantMapModel.findAll({
      where: { restaurantId, isActive: true },
      include: ['restaurant', 'category'],
    });
  }

  async findByRestaurantAndCategory(
    restaurantId: number,
    categoryId: number,
  ): Promise<CategoryRestaurantMap | null> {
    return this.categoryRestaurantMapModel.findOne({
      where: { restaurantId, categoryId },
    });
  }

  async updateIsActive(
    restaurantId: number,
    categoryId: number,
    isActive: boolean,
  ): Promise<CategoryRestaurantMap> {
    let link = await this.findByRestaurantAndCategory(restaurantId, categoryId);

    if (link) {
      await link.update({ isActive });
      return link.reload();
    } else if (isActive) {
      // If link doesn't exist and we want to activate, create a new one
      return this.create({ restaurantId, categoryId, isActive });
    } else {
      // If link doesn't exist and we want to deactivate, do nothing or throw error
      throw new NotFoundException(
        `Liên kết nhà hàng ${restaurantId} và danh mục ${categoryId} không tồn tại để vô hiệu hóa.`,
      );
    }
  }
}
