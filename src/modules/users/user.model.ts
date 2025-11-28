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
import { Role } from '../roles/role.model';
import { Address } from '../addresses/address.model';
import { Restaurant } from '../restaurants/restaurant.model';
import { Order } from '../orders/order.model';
import { Response } from '../responses/response.model';
import { Notification } from '../notifications/notification.model';
import { Cart } from '../carts/cart.model';
import { UserAddress } from '../user-addresses/user-address.model';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
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
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  gender: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @BelongsToMany(() => Address, () => UserAddress)
  addresses: Address[];

  @HasMany(() => Restaurant)
  restaurants: Restaurant[];

  @HasMany(() => Order)
  orders: Order[];

  @HasMany(() => Response, { foreignKey: 'sentId' })
  responses: Response[];

  @HasMany(() => Notification, {
    as: 'sentNotifications',
    foreignKey: 'sentId',
  })
  sentNotifications: Notification[];

  @HasMany(() => Notification, {
    as: 'receivedNotifications',
    foreignKey: 'receivedId',
  })
  receivedNotifications: Notification[];

  @HasMany(() => Cart)
  carts: Cart[];
}
