import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductCategory } from './product-category.model';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectModel(ProductCategory)
    private readonly productCategoryModel: typeof ProductCategory,
  ) {}

  async create(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategory> {
    return this.productCategoryModel.create({
      ...createProductCategoryDto,
      isActive: createProductCategoryDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<ProductCategory[]> {
    // Trả về tất cả categories (không filter isActive) để hiển thị đầy đủ trong form thêm sản phẩm
    return this.productCategoryModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: number): Promise<ProductCategory> {
    const category = await this.productCategoryModel.findOne({
      where: { id, isActive: true },
    });

    if (!category) {
      throw new NotFoundException(
        `Product category với ID ${id} không tồn tại`,
      );
    }

    return category;
  }

  async update(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    const category = await this.findOne(id);
    await category.update(updateProductCategoryDto);
    return category.reload();
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await category.update({ isActive: false });
  }
}
