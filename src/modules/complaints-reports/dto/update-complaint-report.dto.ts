import { PartialType } from '@nestjs/mapped-types';
import { CreateComplaintReportDto } from './create-complaint-report.dto';

export class UpdateComplaintReportDto extends PartialType(
  CreateComplaintReportDto,
) {}
