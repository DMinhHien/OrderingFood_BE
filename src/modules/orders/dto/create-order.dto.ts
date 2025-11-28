import {
  IsBoolean,
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  totalPrice: number;

  @IsInt()
  @IsNotEmpty()
  status: number;

  @IsInt()
  @IsNotEmpty()
  shippingFee: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  restaurantId: number;

  @IsInt()
  @IsNotEmpty()
  addressId: number;

  @IsInt()
  @IsOptional()
  discountId?: number;
}
