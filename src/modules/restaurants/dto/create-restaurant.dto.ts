import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  openTime?: string;

  @IsString()
  @IsOptional()
  closeTime?: string;

  @IsInt()
  @IsOptional()
  rating?: number;

  @IsInt()
  @IsOptional()
  status?: number;

  @IsInt()
  @IsNotEmpty()
  categorieRestaurantID: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  addressId: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
