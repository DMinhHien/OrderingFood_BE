import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryModel.create({
      ...createCategoryDto,
      isActive: createCategoryDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.findAll({
      where: { isActive: true },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryModel.findOne({
      where: { id, isActive: true },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    await category.update(updateCategoryDto);
    return category.reload();
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await category.update({ isActive: false });
  }
}
