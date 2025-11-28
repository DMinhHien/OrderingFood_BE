import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryProductMap } from './category-product-map.model';
import { CreateCategoryProductMapDto } from './dto/create-category-product-map.dto';
import { UpdateCategoryProductMapDto } from './dto/update-category-product-map.dto';

@Injectable()
export class CategoryProductMapService {
  constructor(
    @InjectModel(CategoryProductMap)
    private readonly categoryProductMapModel: typeof CategoryProductMap,
  ) {}

  async create(
    createCategoryProductMapDto: CreateCategoryProductMapDto,
  ): Promise<CategoryProductMap> {
    return this.categoryProductMapModel.create({
      ...createCategoryProductMapDto,
    } as CategoryProductMap);
  }

  async findAll(): Promise<CategoryProductMap[]> {
    return this.categoryProductMapModel.findAll({
      include: ['product', 'category'],
    });
  }

  async findOne(id: number): Promise<CategoryProductMap> {
    const link = await this.categoryProductMapModel.findByPk(id, {
      include: ['product', 'category'],
    });

    if (!link) {
      throw new NotFoundException(
        `Liên kết sản phẩm - danh mục với ID ${id} không tồn tại`,
      );
    }

    return link;
  }

  async update(
    id: number,
    updateCategoryProductMapDto: UpdateCategoryProductMapDto,
  ): Promise<CategoryProductMap> {
    const link = await this.findOne(id);
    await link.update(updateCategoryProductMapDto);
    return link.reload();
  }

  async remove(id: number): Promise<void> {
    const link = await this.findOne(id);
    await link.destroy();
  }
}
