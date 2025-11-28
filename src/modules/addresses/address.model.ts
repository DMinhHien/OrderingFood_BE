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
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Restaurant } from '../restaurants/restaurant.model';
import { Order } from '../orders/order.model';
import { UserAddress } from '../user-addresses/user-address.model';

@Table({
  tableName: 'address',
  timestamps: true,
})
export class Address extends Model<Address> {
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
  label: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  province: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  district: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ward: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  street: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  latitude: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  longitude: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isDefault: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @BelongsToMany(() => User, () => UserAddress)
  users: User[];

  @HasMany(() => Restaurant)
  restaurants: Restaurant[];

  @HasMany(() => Order)
  orders: Order[];
}
