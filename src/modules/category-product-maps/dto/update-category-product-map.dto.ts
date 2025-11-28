import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryProductMapDto } from './create-category-product-map.dto';

export class UpdateCategoryProductMapDto extends PartialType(
  CreateCategoryProductMapDto,
) {}
