import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productModel.create({
      ...createProductDto,
      available: createProductDto.available ?? true,
      isActive: createProductDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.findAll({
      where: { isActive: true },
      include: ['category', 'restaurant'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productModel.findOne({
      where: { id, isActive: true },
      include: ['category', 'restaurant'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    await product.update(updateProductDto);
    return product.reload();
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await product.update({ isActive: false });
  }
}
