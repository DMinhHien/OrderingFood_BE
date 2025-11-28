import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserAddressDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  addressId: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
