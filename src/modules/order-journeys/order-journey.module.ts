import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderJourney } from './order-journey.model';
import { OrderJourneyService } from './order-journey.service';
import { OrderJourneyController } from './order-journey.controller';
import { NotificationModule } from '../notifications/notification.module';
import { Order } from '../orders/order.model';
import { Restaurant } from '../restaurants/restaurant.model';

@Module({
  imports: [
    SequelizeModule.forFeature([OrderJourney, Order, Restaurant]),
    NotificationModule,
  ],
  providers: [OrderJourneyService],
  controllers: [OrderJourneyController],
})
export class OrderJourneyModule {}
