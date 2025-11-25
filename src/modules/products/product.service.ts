import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductCategory } from '../product-categories/product-category.model';
import { Restaurant } from '../restaurants/restaurant.model';
import { Menu } from '../menus/menu.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(ProductCategory)
    private readonly productCategoryModel: typeof ProductCategory,
    @InjectModel(Restaurant)
    private readonly restaurantModel: typeof Restaurant,
    @InjectModel(Menu)
    private readonly menuModel: typeof Menu,
  ) {}

  private async ensureCategory(id: number): Promise<void> {
    const category = await this.productCategoryModel.findOne({
      where: { id, isActive: true },
    });

    if (!category) {
      throw new NotFoundException(
        `Product category với ID ${id} không tồn tại hoặc đã bị vô hiệu hóa`,
      );
    }
  }

  private async ensureRestaurant(id: number): Promise<void> {
    const restaurant = await this.restaurantModel.findOne({
      where: { id, isActive: true },
    });

    if (!restaurant) {
      throw new NotFoundException(
        `Nhà hàng với ID ${id} không tồn tại hoặc đã bị vô hiệu hóa`,
      );
    }
  }

  private async ensureMenu(
    menuId: number,
    restaurantId?: number,
  ): Promise<void> {
    const where: Record<string, unknown> = { id: menuId, isActive: true };

    if (typeof restaurantId !== 'undefined') {
      where.restaurantID = restaurantId;
    }

    const menu = await this.menuModel.findOne({ where });

    if (menu) {
      return;
    }

    const existingMenu = await this.menuModel.findOne({
      where: { id: menuId, isActive: true },
    });

    if (!existingMenu) {
      throw new NotFoundException(`Menu với ID ${menuId} không tồn tại`);
    }

    throw new BadRequestException(
      'Menu được chọn không thuộc về nhà hàng của sản phẩm',
    );
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    await this.ensureCategory(createProductDto.categorieProductId);
    await this.ensureRestaurant(createProductDto.restaurantID);

    if (createProductDto.menuID) {
      await this.ensureMenu(
        createProductDto.menuID,
        createProductDto.restaurantID,
      );
    }

    const product = await this.productModel.create({
      ...createProductDto,
      available: createProductDto.available ?? true,
      isActive: createProductDto.isActive ?? true,
    } as any);

    return this.findOne(product.id);
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.findAll({
      where: { isActive: true },
      include: ['productCategory', 'restaurant', 'menu'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productModel.findOne({
      where: { id, isActive: true },
      include: ['productCategory', 'restaurant', 'menu'],
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

    if (updateProductDto.categorieProductId) {
      await this.ensureCategory(updateProductDto.categorieProductId);
    }

    const targetRestaurantId =
      updateProductDto.restaurantID ?? product.restaurantID;

    if (updateProductDto.restaurantID) {
      await this.ensureRestaurant(updateProductDto.restaurantID);
    }

    if (updateProductDto.menuID) {
      await this.ensureMenu(updateProductDto.menuID, targetRestaurantId);
    }

    await product.update(updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await product.update({ isActive: false });
  }
}
