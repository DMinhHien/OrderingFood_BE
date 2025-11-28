import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCategoryProductMapDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
