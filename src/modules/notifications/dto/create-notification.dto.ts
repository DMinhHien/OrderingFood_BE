import {
  IsBoolean,
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsNotEmpty()
  type: number;

  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @IsNotEmpty()
  receivedId: number;

  @IsInt()
  @IsNotEmpty()
  orderId: number;
}
