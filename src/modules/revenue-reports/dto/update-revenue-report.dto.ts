import { PartialType } from '@nestjs/mapped-types';
import { CreateRevenueReportDto } from './create-revenue-report.dto';

export class UpdateRevenueReportDto extends PartialType(
  CreateRevenueReportDto,
) {}
