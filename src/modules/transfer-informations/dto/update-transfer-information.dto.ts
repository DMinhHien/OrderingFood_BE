import { PartialType } from '@nestjs/swagger';
import { CreateTransferInformationDto } from './create-transfer-information.dto';

export class UpdateTransferInformationDto extends PartialType(
  CreateTransferInformationDto,
) {}
