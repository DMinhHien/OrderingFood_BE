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
import { User } from '../users/user.model';

@Table({
  tableName: 'responses',
  timestamps: true,
})
export class Response extends Model<Response> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sellId: number;

  @BelongsTo(() => User, { as: 'seller', foreignKey: 'sellId' })
  seller: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  reviewId: number;

  @BelongsTo(() => User, { as: 'reviewer', foreignKey: 'reviewId' })
  reviewer: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  adminId: number;

  @BelongsTo(() => User, { as: 'admin', foreignKey: 'adminId' })
  admin: User;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  content: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  response: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
