import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Restaurant } from './restaurant.model';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { RestaurantCategoryModule } from '../restaurant-categories/restaurant-category.module';
import { UserModule } from '../users/user.module';
import { AddressModule } from '../addresses/address.module';
import { Product } from '../products/product.model';
import { CategoryProductMap } from '../category-product-maps/category-product-map.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Restaurant, Product, CategoryProductMap]),
    RestaurantCategoryModule,
    UserModule,
    AddressModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
