import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryProductMap } from './category-product-map.model';
import { CategoryProductMapService } from './category-product-map.service';
import { CategoryProductMapController } from './category-product-map.controller';
import { Product } from '../products/product.model';
import { ProductCategory } from '../product-categories/product-category.model';

@Module({
  imports: [
    SequelizeModule.forFeature([CategoryProductMap, Product, ProductCategory]),
  ],
  controllers: [CategoryProductMapController],
  providers: [CategoryProductMapService],
  exports: [CategoryProductMapService],
})
export class CategoryProductMapModule {}
