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
import { Feedback } from '../feedbacks/feedback.model';

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
  sentId: number;

  @BelongsTo(() => User, { as: 'sender', foreignKey: 'sentId' })
  sender: User;

  @ForeignKey(() => Feedback)
  @Column({
    field: 'feedbackID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  feedbackId: number;

  @BelongsTo(() => Feedback, { as: 'feedback', foreignKey: 'feedbackId' })
  feedback: Feedback;

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
