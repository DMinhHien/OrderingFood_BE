import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from '../products/product.model';
import { ProductCategory } from '../product-categories/product-category.model';

@Table({
  tableName: 'category_product_map',
  timestamps: true,
})
export class CategoryProductMap extends Model<CategoryProductMap> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @ForeignKey(() => Product)
  @Column({
    field: 'productID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => ProductCategory)
  @Column({
    field: 'categoryID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  categoryId: number;

  @BelongsTo(() => ProductCategory)
  category: ProductCategory;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
