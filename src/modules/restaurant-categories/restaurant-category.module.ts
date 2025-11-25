import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RestaurantCategory } from './restaurant-category.model';
import { RestaurantCategoryService } from './restaurant-category.service';
import { RestaurantCategoryController } from './restaurant-category.controller';

@Module({
  imports: [SequelizeModule.forFeature([RestaurantCategory])],
  controllers: [RestaurantCategoryController],
  providers: [RestaurantCategoryService],
  exports: [RestaurantCategoryService],
})
export class RestaurantCategoryModule {}
