import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RestaurantDashboardService } from './restaurant-dashboard.service';
import { RestaurantDashboardController } from './restaurant-dashboard.controller';
import { Order } from '../orders/order.model';
import { Feedback } from '../feedbacks/feedback.model';
import { Restaurant } from '../restaurants/restaurant.model';

@Module({
  imports: [SequelizeModule.forFeature([Order, Feedback, Restaurant])],
  controllers: [RestaurantDashboardController],
  providers: [RestaurantDashboardService],
  exports: [RestaurantDashboardService],
})
export class RestaurantDashboardModule {}
