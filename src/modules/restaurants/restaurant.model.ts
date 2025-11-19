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
import { User } from '../users/user.model';
import { Address } from '../addresses/address.model';
import { Product } from '../products/product.model';
import { Order } from '../orders/order.model';
import { RevenueReport } from '../revenue-reports/revenue-report.model';

@Table({
  tableName: 'restaurants',
  timestamps: true,
})
export class Restaurant extends Model<Restaurant> {
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
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  openTime: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  closeTime: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  rating: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  status: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  categorieID: number;

  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Address)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  addressId: number;

  @BelongsTo(() => Address)
  address: Address;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => Product)
  products: Product[];

  @HasMany(() => Order)
  orders: Order[];

  @HasMany(() => RevenueReport)
  revenueReports: RevenueReport[];
}
