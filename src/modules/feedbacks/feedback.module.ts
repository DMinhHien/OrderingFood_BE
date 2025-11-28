import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Feedback } from './feedback.model';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { Order } from '../orders/order.model';
import { Restaurant } from '../restaurants/restaurant.model';

@Module({
  imports: [SequelizeModule.forFeature([Feedback, Order, Restaurant])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
