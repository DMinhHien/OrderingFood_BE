import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RevenueReport } from './revenue-report.model';
import { RevenueReportService } from './revenue-report.service';
import { RevenueReportController } from './revenue-report.controller';
import { RestaurantModule } from '../restaurants/restaurant.module';

@Module({
  imports: [SequelizeModule.forFeature([RevenueReport]), RestaurantModule],
  controllers: [RevenueReportController],
  providers: [RevenueReportService],
  exports: [RevenueReportService],
})
export class RevenueReportModule {}
