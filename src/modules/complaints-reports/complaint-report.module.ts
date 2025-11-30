import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ComplaintReport } from './complaint-report.model';
import { ComplaintReportService } from './complaint-report.service';
import { ComplaintReportController } from './complaint-report.controller';
import { User } from '../users/user.model';

@Module({
  imports: [SequelizeModule.forFeature([ComplaintReport, User])],
  controllers: [ComplaintReportController],
  providers: [ComplaintReportService],
  exports: [ComplaintReportService],
})
export class ComplaintReportModule {}
