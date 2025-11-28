import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderJourney } from './order-journey.model';
import { OrderJourneyService } from './order-journey.service';
import { OrderJourneyController } from './order-journey.controller';

@Module({
  imports: [SequelizeModule.forFeature([OrderJourney])],
  providers: [OrderJourneyService],
  controllers: [OrderJourneyController],
})
export class OrderJourneyModule {}
