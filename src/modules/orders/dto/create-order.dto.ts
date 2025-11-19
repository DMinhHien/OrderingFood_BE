import { IsBoolean, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

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
  @IsNotEmpty()
  discountId: number;
}
