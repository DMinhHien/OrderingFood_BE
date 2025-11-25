import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantCategoryDto } from './create-restaurant-category.dto';

export class UpdateRestaurantCategoryDto extends PartialType(
  CreateRestaurantCategoryDto,
) {}
