import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'ID of the user' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Username of the user' })
  @Expose()
  username: string;

  @ApiProperty({ description: 'Email address of the user' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Phone number of the user' })
  @Expose()
  phone: string;

  @ApiProperty({ description: 'Creation date formatted as dd/mm/yyyy' })
  @Expose()
  @Transform(({ value }) => {
    if (!value) return null;
    const date = new Date(value);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  })
  createdAt: string;

  @ApiProperty({ description: 'Status of the user' })
  @Expose()
  isActive: boolean;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

