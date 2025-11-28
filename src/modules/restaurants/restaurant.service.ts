import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Restaurant } from './restaurant.model';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CategoryProductMap } from '../category-product-maps/category-product-map.model';
import { Op } from 'sequelize';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant)
    private restaurantModel: typeof Restaurant,
    @InjectModel(CategoryProductMap)
    private categoryProductMapModel: typeof CategoryProductMap,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    return this.restaurantModel.create({
      ...createRestaurantDto,
      isActive: createRestaurantDto.isActive ?? true,
    } as any);
  }

  private getBaseInclude(productCategoryIds?: number[]) {
    const requireProductMatch =
      Array.isArray(productCategoryIds) && productCategoryIds.length > 0;

    const productCategoriesInclude = requireProductMatch
      ? [
          {
            association: 'categories',
            required: true,
            where: { id: { [Op.in]: productCategoryIds } },
          },
        ]
      : [
          {
            association: 'categories',
            required: false,
          },
        ];

    return [
      {
        association: 'categories',
        required: false,
      },
      'user',
      'address',
      {
        association: 'products',
        required: requireProductMatch,
        where: { isActive: true },
        include: productCategoriesInclude,
      },
    ];
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantModel.findAll({
      where: { isActive: true },
      include: this.getBaseInclude(),
    });
  }

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findOne({
      where: { id, isActive: true },
      include: this.getBaseInclude(),
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

  async findByOwner(userId: number): Promise<Restaurant[]> {
    return this.restaurantModel.findAll({
      where: { userId, isActive: true },
      include: this.getBaseInclude(),
      order: [['createdAt', 'DESC']],
    });
  }

  // Tìm kiếm restaurants theo tên và category
  // Nếu truyền productCategoryIds, tìm restaurants có products với các category đó
  // Nếu truyền restaurantCategoryIds, tìm restaurants có restaurant categories đó
  async search(
    query?: string,
    productCategoryIds?: number[],
    restaurantCategoryIds?: number[],
  ): Promise<Restaurant[]> {
    const where: any = { isActive: true };

    if (query) {
      where.name = { [Op.like]: `%${query}%` };
    }

    // Nếu có productCategoryIds, tìm restaurants có products với các category đó
    if (productCategoryIds && productCategoryIds.length > 0) {
      // Bước 1: Tìm tất cả products có TẤT CẢ các category đã chọn
      // Lấy tất cả category-product-maps với các categoryId đã chọn
      const allMaps = await this.categoryProductMapModel.findAll({
        where: {
          categoryId: { [Op.in]: productCategoryIds },
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
      productCategoryMap.forEach((categoryIds, productId) => {
        const hasAllCategories = productCategoryIds.every((catId) =>
          categoryIds.has(catId),
        );
        if (hasAllCategories) {
          validProductIds.push(productId);
        }
      });

      if (validProductIds.length === 0) {
        return []; // Không có product nào thỏa mãn
      }

      // Bước 2: Lấy restaurantIds từ các products hợp lệ (sử dụng parameterized query để tránh SQL injection)
      const { QueryTypes } = require('sequelize');
      const placeholders = validProductIds.map(() => '?').join(',');
      const productsWithRestaurants =
        await this.restaurantModel.sequelize!.query(
          `SELECT DISTINCT "restaurantID" FROM products WHERE id IN (${placeholders}) AND "isActive" = true`,
          {
            type: QueryTypes.SELECT,
            replacements: validProductIds,
          },
        );
      const restaurantIds = (productsWithRestaurants as any[])
        .map((r: any) => r.restaurantID || r.restaurantId)
        .filter((id: any) => id != null);

      if (restaurantIds.length === 0) {
        return [];
      }

      // Bước 3: Lấy tất cả restaurants có các products đó
      const restaurantsWithValidProducts = await this.restaurantModel.findAll({
        where: {
          ...where,
          id: { [Op.in]: restaurantIds },
        },
        include: [
          {
            association: 'categories',
            required: false,
          },
          'user',
          'address',
          {
            association: 'products',
            required: false,
            where: { isActive: true },
          },
        ],
      });

      return restaurantsWithValidProducts;
    }

    const include: any[] = [
      {
        association: 'categories',
        required: false,
      },
      'user',
      'address',
      {
        association: 'products',
        required: false,
        where: { isActive: true },
      },
    ];

    // Nếu có restaurantCategoryIds, chỉ lấy restaurants có TẤT CẢ các category đã chọn
    if (restaurantCategoryIds && restaurantCategoryIds.length > 0) {
      // Lấy tất cả restaurants có ít nhất một category trong danh sách
      const restaurantsWithCategories = await this.restaurantModel.findAll({
        where,
        include: [
          {
            association: 'categories',
            where: { id: { [Op.in]: restaurantCategoryIds } },
            required: true,
          },
          'user',
          'address',
          {
            association: 'products',
            required: false,
            where: { isActive: true },
          },
        ],
      });

      // Filter để chỉ giữ lại restaurants có TẤT CẢ các category đã chọn
      const filteredRestaurants: Restaurant[] = [];
      for (const restaurant of restaurantsWithCategories) {
        const restaurantCatIds = (restaurant.categories || []).map(
          (cat: any) => cat.id,
        );
        // Kiểm tra xem restaurant có tất cả restaurantCategoryIds không
        const hasAllCategories = restaurantCategoryIds.every((catId) =>
          restaurantCatIds.includes(catId),
        );
        if (hasAllCategories) {
          filteredRestaurants.push(restaurant);
        }
      }

      return filteredRestaurants;
    } else {
      return this.restaurantModel.findAll({
        where,
        include,
      });
    }
  }
}
