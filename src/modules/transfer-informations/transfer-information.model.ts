import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({ tableName: 'transfer_informations', timestamps: true })
export class TransferInformation extends Model<TransferInformation> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  paymentMethod: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isBank: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  nameBank: string;

  @Column({ type: DataType.STRING, allowNull: true })
  accountNumber: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
