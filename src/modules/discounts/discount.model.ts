import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { Order } from '../orders/order.model';

@Table({
  tableName: 'discounts',
  timestamps: true,
})
export class Discount extends Model<Discount> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  code: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  type: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  percent: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  discountmoney: number;

  @Column({
    field: 'minOrderValue',
    type: DataType.INTEGER,
    allowNull: true,
  })
  minOrderValue: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startTime: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endTime: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  status: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => Order)
  orders: Order[];
}
