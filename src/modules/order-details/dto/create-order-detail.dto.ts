import {
  IsBoolean,
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateOrderDetailDto {
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  orderId: number;
}
