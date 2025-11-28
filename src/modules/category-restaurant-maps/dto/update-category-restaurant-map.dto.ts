import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryRestaurantMapDto } from './create-category-restaurant-map.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCategoryRestaurantMapDto extends PartialType(
  CreateCategoryRestaurantMapDto,
) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
