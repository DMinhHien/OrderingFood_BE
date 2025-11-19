import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  percent?: number;

  @IsInt()
  @IsOptional()
  minOrderVale?: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
