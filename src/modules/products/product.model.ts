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
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { ProductCategory } from '../product-categories/product-category.model';
import { Restaurant } from '../restaurants/restaurant.model';
import { OrderDetail } from '../order-details/order-detail.model';
import { Menu } from '../menus/menu.model';
import { CartItem } from '../cart-items/cart-item.model';
import { CategoryProductMap } from '../category-product-maps/category-product-map.model';

@Table({
  tableName: 'products',
  timestamps: true,
})
export class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  available: boolean;

  @ForeignKey(() => Restaurant)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  restaurantID: number;

  @BelongsTo(() => Restaurant)
  restaurant: Restaurant;

  @ForeignKey(() => Menu)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  menuID: number | null;

  @BelongsTo(() => Menu)
  menu: Menu | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @BelongsToMany(() => ProductCategory, () => CategoryProductMap)
  categories: ProductCategory[];

  @HasMany(() => OrderDetail)
  orderDetails: OrderDetail[];

  @HasMany(() => CartItem)
  cartItems: CartItem[];
}
