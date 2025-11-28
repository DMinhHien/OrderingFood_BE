import {
  IsBoolean,
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateResponseDto {
  @IsInt()
  @IsNotEmpty()
  sentId: number;

  @IsInt()
  @IsNotEmpty()
  feedbackId: number;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  response?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
