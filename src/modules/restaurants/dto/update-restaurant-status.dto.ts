import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRestaurantStatusDto {
  @ApiProperty({
    description: 'The active status of the restaurant',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}

