import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @IsInt()
  @IsNotEmpty()
  categorieId: number;

  @IsInt()
  @IsNotEmpty()
  restaurantID: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
