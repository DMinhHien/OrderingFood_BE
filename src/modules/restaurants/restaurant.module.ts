import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Restaurant } from './restaurant.model';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { RestaurantCategoryModule } from '../restaurant-categories/restaurant-category.module';
import { UserModule } from '../users/user.module';
import { AddressModule } from '../addresses/address.module';
import { Product } from '../products/product.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Restaurant, Product]),
    RestaurantCategoryModule,
    UserModule,
    AddressModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
