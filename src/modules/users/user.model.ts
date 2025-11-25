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
import { Role } from '../roles/role.model';
import { Address } from '../addresses/address.model';
import { Restaurant } from '../restaurants/restaurant.model';
import { Order } from '../orders/order.model';
import { Response } from '../responses/response.model';
import { Notification } from '../notifications/notification.model';
import { Cart } from '../carts/cart.model';

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

  @ForeignKey(() => Address)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  addressId: number | null;

  @BelongsTo(() => Address)
  address: Address | null;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => Restaurant)
  restaurants: Restaurant[];

  @HasMany(() => Order)
  orders: Order[];

  @HasMany(() => Response, { as: 'sellerResponses', foreignKey: 'sellId' })
  sellerResponses: Response[];

  @HasMany(() => Response, { as: 'reviewerResponses', foreignKey: 'reviewId' })
  reviewerResponses: Response[];

  @HasMany(() => Response, { as: 'adminResponses', foreignKey: 'adminId' })
  adminResponses: Response[];

  @HasMany(() => Notification)
  notifications: Notification[];

  @HasMany(() => Cart)
  carts: Cart[];
}
