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
import { User } from '../users/user.model';
import { Restaurant } from '../restaurants/restaurant.model';
import { Address } from '../addresses/address.model';
import { Discount } from '../discounts/discount.model';
import { OrderDetail } from '../order-details/order-detail.model';
import { Payment } from '../payments/payment.model';
import { Feedback } from '../feedbacks/feedback.model';
import { Notification } from '../notifications/notification.model';

@Table({
  tableName: 'orders',
  timestamps: true,
})
export class Order extends Model<Order> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  totalPrice: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  status: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  shippingFee: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  note: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Restaurant)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  restaurantId: number;

  @BelongsTo(() => Restaurant)
  restaurant: Restaurant;

  @ForeignKey(() => Address)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  addressId: number;

  @BelongsTo(() => Address)
  address: Address;

  @ForeignKey(() => Discount)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  discountId: number;

  @BelongsTo(() => Discount)
  discount: Discount;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => OrderDetail)
  orderDetails: OrderDetail[];

  @HasMany(() => Payment)
  payments: Payment[];

  @HasMany(() => Feedback)
  feedbacks: Feedback[];

  @HasMany(() => Notification)
  notifications: Notification[];
}
