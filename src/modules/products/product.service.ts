import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Restaurant } from '../restaurants/restaurant.model';
import { Menu } from '../menus/menu.model';
import { OrderDetail } from '../order-details/order-detail.model';
import { CategoryProductMap } from '../category-product-maps/category-product-map.model';
import { Op, QueryTypes } from 'sequelize';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(Restaurant)
    private readonly restaurantModel: typeof Restaurant,
    @InjectModel(Menu)
    private readonly menuModel: typeof Menu,
    @InjectModel(OrderDetail)
    private readonly orderDetailModel: typeof OrderDetail,
    @InjectModel(CategoryProductMap)
    private categoryProductMapModel: typeof CategoryProductMap,
  ) {}

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
      include: ['categories', 'restaurant', 'menu'],
    });
  }

  async findByRestaurant(restaurantId: number): Promise<Product[]> {
    return this.productModel.findAll({
      where: { restaurantID: restaurantId, isActive: true },
      include: ['categories', 'restaurant', 'menu'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productModel.findOne({
      where: { id, isActive: true },
      include: ['categories', 'restaurant', 'menu'],
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

  // Lấy top 5 products có nhiều order nhất, nếu không đủ thì bổ sung bằng các món mới nhất
  async findPopularProducts(limit: number = 5): Promise<Product[]> {
    const sequelize = this.productModel.sequelize;
    if (!sequelize) {
      // Fallback: lấy các món mới nhất
      return this.productModel.findAll({
        where: { isActive: true },
        include: ['categories', 'restaurant', 'menu'],
        order: [['createdAt', 'DESC']],
        limit,
      });
    }

    // Lấy các products có nhiều order nhất
    const results = await sequelize.query(
      `
      SELECT "productId", COUNT(*) as "orderCount"
      FROM "order_details"
      WHERE "isActive" = true
      GROUP BY "productId"
      ORDER BY "orderCount" DESC
      LIMIT :limit
    `,
      {
        replacements: { limit },
        type: QueryTypes.SELECT,
      },
    );

    const productIds = (results as any[]).map((item: any) => item.productId);
    const popularProducts: Product[] = [];

    if (productIds.length > 0) {
      const products = await this.productModel.findAll({
        where: {
          id: productIds,
          isActive: true,
        },
        include: ['categories', 'restaurant', 'menu'],
      });

      // Sắp xếp theo thứ tự productIds để giữ nguyên thứ tự popularity
      popularProducts.push(
        ...products.sort((a, b) => {
          const indexA = productIds.indexOf(a.id);
          const indexB = productIds.indexOf(b.id);
          return indexA - indexB;
        }),
      );
    }

    // Nếu chưa đủ limit, bổ sung bằng các món mới nhất
    if (popularProducts.length < limit) {
      const remainingCount = limit - popularProducts.length;
      const existingIds = popularProducts.map((p) => p.id);

      const whereCondition: any = { isActive: true };
      if (existingIds.length > 0) {
        whereCondition.id = { [Op.notIn]: existingIds };
      }

      const recentProducts = await this.productModel.findAll({
        where: whereCondition,
        include: ['categories', 'restaurant', 'menu'],
        order: [['createdAt', 'DESC']],
        limit: remainingCount,
      });

      popularProducts.push(...recentProducts);
    }

    return popularProducts.slice(0, limit);
  }

  // Tìm kiếm products theo tên và category
  async search(query?: string, categoryIds?: number[]): Promise<Product[]> {
    const where: any = { isActive: true };

    if (query) {
      where[Op.or] = [
        { name: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } },
      ];
    }

    const include: any[] = ['restaurant', 'menu'];

    // Nếu có categoryIds, chỉ lấy products có TẤT CẢ các category đã chọn
    if (categoryIds && categoryIds.length > 0) {
      // Bước 1: Tìm tất cả products có TẤT CẢ các category đã chọn
      // Lấy tất cả category-product-maps với các categoryId đã chọn
      const allMaps = await this.categoryProductMapModel.findAll({
        where: {
          categoryId: { [Op.in]: categoryIds },
        },
        attributes: ['productId', 'categoryId'],
        raw: true,
      });

      // Nhóm theo productId để tìm products có TẤT CẢ các category
      const productCategoryMap = new Map<number, Set<number>>();
      (allMaps as any[]).forEach((map: any) => {
        // Sequelize trả về tên field theo model (productId, categoryId) hoặc DB (productID, categoryID)
        const productId = map.productId || map.productID;
        const categoryId = map.categoryId || map.categoryID;
        if (productId && categoryId) {
          if (!productCategoryMap.has(productId)) {
            productCategoryMap.set(productId, new Set<number>());
          }
          productCategoryMap.get(productId)!.add(categoryId);
        }
      });

      // Filter để chỉ giữ products có TẤT CẢ các category đã chọn
      const validProductIds: number[] = [];
      productCategoryMap.forEach((productCategorySet, productId) => {
        // Kiểm tra xem product có tất cả categoryIds không
        const hasAllCategories = categoryIds.every((catId) =>
          productCategorySet.has(catId),
        );
        if (hasAllCategories) {
          validProductIds.push(productId);
        }
      });

      if (validProductIds.length === 0) {
        return []; // Không có product nào thỏa mãn
      }

      // Bước 2: Lấy tất cả products với các productIds hợp lệ
      const filteredProducts = await this.productModel.findAll({
        where: {
          ...where,
          id: { [Op.in]: validProductIds },
        },
        include: [
          ...include,
          {
            association: 'categories',
            required: false,
          },
        ],
      });

      return filteredProducts;
    } else {
      include.push({
        association: 'categories',
        required: false,
      });

      return this.productModel.findAll({
        where,
        include,
      });
    }
  }
}
