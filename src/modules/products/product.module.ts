import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { RestaurantModule } from '../restaurants/restaurant.module';
import { MenuModule } from '../menus/menu.module';
import { Restaurant } from '../restaurants/restaurant.model';
import { Menu } from '../menus/menu.model';
import { OrderDetail } from '../order-details/order-detail.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Product, Restaurant, Menu, OrderDetail]),
    RestaurantModule,
    MenuModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
