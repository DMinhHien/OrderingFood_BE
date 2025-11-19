import {
  IsBoolean,
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsInt()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @IsNotEmpty()
  orderId: number;
}
