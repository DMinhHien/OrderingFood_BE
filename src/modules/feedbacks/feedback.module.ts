import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Feedback } from './feedback.model';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { OrderModule } from '../orders/order.module';

@Module({
  imports: [SequelizeModule.forFeature([Feedback]), OrderModule],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
