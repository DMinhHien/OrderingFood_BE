import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'The active status of the user',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}

