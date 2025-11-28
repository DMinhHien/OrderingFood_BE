import { IsInt, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateCategoryRestaurantMapDto {
  @IsInt()
  @IsNotEmpty()
  restaurantId: number;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
