import {
  IsBoolean,
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsInt()
  @IsNotEmpty()
  status: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @IsNotEmpty()
  orderId: number;
}
