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
import { Restaurant } from '../restaurants/restaurant.model';
import { RestaurantCategory } from '../restaurant-categories/restaurant-category.model';

@Table({
  tableName: 'category_restaurant_map',
  timestamps: true,
})
export class CategoryRestaurantMap extends Model<CategoryRestaurantMap> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @ForeignKey(() => Restaurant)
  @Column({
    field: 'restaurantID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  restaurantId: number;

  @BelongsTo(() => Restaurant)
  restaurant: Restaurant;

  @ForeignKey(() => RestaurantCategory)
  @Column({
    field: 'categoryID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  categoryId: number;

  @BelongsTo(() => RestaurantCategory)
  category: RestaurantCategory;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
