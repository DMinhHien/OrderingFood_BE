import { IsInt, IsNotEmpty, IsOptional, Min, IsBoolean } from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  @IsNotEmpty()
  cartId: number;

  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  quantity?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  unitPrice?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
