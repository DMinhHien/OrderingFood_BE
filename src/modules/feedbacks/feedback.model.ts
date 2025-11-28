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
import { Order } from '../orders/order.model';
import { Response } from '../responses/response.model';

@Table({
  tableName: 'feedbacks',
  timestamps: true,
})
export class Feedback extends Model<Feedback> {
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
  rating: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl: string;

  @Column({
    type: DataType.BOOLEAN,
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

  @HasMany(() => Response, { foreignKey: 'feedbackId', as: 'responses' })
  responses: Response[];

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
