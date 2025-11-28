import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, Min, IsBoolean } from 'class-validator';
import { CreateCartItemDto } from './create-cart-item.dto';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {
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
