import { IsBoolean, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class CreateRevenueReportDto {
  @IsInt()
  @IsNotEmpty()
  month: number;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsInt()
  @IsOptional()
  totalOrders?: number;

  @IsInt()
  @IsOptional()
  totalRevenue?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @IsNotEmpty()
  restaurantId: number;
}
