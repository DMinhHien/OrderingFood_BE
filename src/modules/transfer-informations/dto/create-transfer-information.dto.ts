import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransferInformationDto {
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsBoolean()
  @IsOptional()
  isBank?: boolean;

  @IsString()
  @IsOptional()
  nameBank?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  userId: number;
}
