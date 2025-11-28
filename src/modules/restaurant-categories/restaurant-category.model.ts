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
import { Restaurant } from '../restaurants/restaurant.model';
import { CategoryRestaurantMap } from '../category-restaurant-maps/category-restaurant-map.model';

@Table({
  tableName: 'categories_restaurant',
  timestamps: true,
})
export class RestaurantCategory extends Model<RestaurantCategory> {
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
  name: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @BelongsToMany(() => Restaurant, () => CategoryRestaurantMap)
  restaurants: Restaurant[];
}
