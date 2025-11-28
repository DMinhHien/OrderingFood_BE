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
import { Order } from '../orders/order.model';

@Table({
  tableName: 'order_journeys',
  timestamps: true,
})
export class OrderJourney extends Model<OrderJourney> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  content: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  latitude: number;

  @Column({
    field: 'longtitude',
    type: DataType.FLOAT,
    allowNull: false,
  })
  longitude: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  timeline: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  orderId: number;

  @BelongsTo(() => Order)
  order: Order;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
