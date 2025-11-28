import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryRestaurantMap } from './category-restaurant-map.model';
import { CategoryRestaurantMapService } from './category-restaurant-map.service';
import { CategoryRestaurantMapController } from './category-restaurant-map.controller';
import { Restaurant } from '../restaurants/restaurant.model';
import { RestaurantCategory } from '../restaurant-categories/restaurant-category.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CategoryRestaurantMap,
      Restaurant,
      RestaurantCategory,
    ]),
  ],
  controllers: [CategoryRestaurantMapController],
  providers: [CategoryRestaurantMapService],
  exports: [CategoryRestaurantMapService],
})
export class CategoryRestaurantMapModule {}
