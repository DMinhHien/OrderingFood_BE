import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryModule } from '../categories/category.module';
import { RestaurantModule } from '../restaurants/restaurant.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
    CategoryModule,
    RestaurantModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
