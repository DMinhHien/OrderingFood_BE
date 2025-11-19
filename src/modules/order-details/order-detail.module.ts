import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderDetail } from './order-detail.model';
import { OrderDetailService } from './order-detail.service';
import { OrderDetailController } from './order-detail.controller';
import { ProductModule } from '../products/product.module';
import { OrderModule } from '../orders/order.module';

@Module({
  imports: [
    SequelizeModule.forFeature([OrderDetail]),
    ProductModule,
    OrderModule,
  ],
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
  exports: [OrderDetailService],
})
export class OrderDetailModule {}
