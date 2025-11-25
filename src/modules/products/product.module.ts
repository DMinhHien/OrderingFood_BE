import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductCategoryModule } from '../product-categories/product-category.module';
import { RestaurantModule } from '../restaurants/restaurant.module';
import { MenuModule } from '../menus/menu.module';
import { ProductCategory } from '../product-categories/product-category.model';
import { Restaurant } from '../restaurants/restaurant.model';
import { Menu } from '../menus/menu.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Product, ProductCategory, Restaurant, Menu]),
    ProductCategoryModule,
    RestaurantModule,
    MenuModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
