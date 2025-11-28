import { PartialType } from '@nestjs/mapped-types';
import {
  IsOptional,
  IsArray,
  ValidateNested,
  IsString,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderDto } from './create-order.dto';

class UpdateOrderDetailDto {
  @IsInt()
  @IsOptional()
  id?: number; // Nếu có id thì update, không có thì create mới

  @IsInt()
  @IsOptional()
  productId?: number;

  @IsInt()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  note?: string;
}

class UpdatePaymentDto {
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsInt()
  @IsOptional()
  status?: number;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderDetailDto)
  orderDetails?: UpdateOrderDetailDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePaymentDto)
  payment?: UpdatePaymentDto;
}
