import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RevenueReportService } from './revenue-report.service';
import { RevenueReportController } from './revenue-report.controller';
import { Order } from '../orders/order.model';
import { OrderDetail } from '../order-details/order-detail.model';
import { Menu } from '../menus/menu.model';

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderDetail, Menu])],
  controllers: [RevenueReportController],
  providers: [RevenueReportService],
  exports: [RevenueReportService],
})
export class RevenueReportModule {}
