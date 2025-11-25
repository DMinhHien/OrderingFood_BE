import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateRestaurantCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
