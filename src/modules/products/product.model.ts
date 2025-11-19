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
} from 'sequelize-typescript';
import { Category } from '../categories/category.model';
import { Restaurant } from '../restaurants/restaurant.model';
import { OrderDetail } from '../order-details/order-detail.model';

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

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  categorieId: number;

  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => Restaurant)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  restaurantID: number;

  @BelongsTo(() => Restaurant)
  restaurant: Restaurant;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => OrderDetail)
  orderDetails: OrderDetail[];
}
