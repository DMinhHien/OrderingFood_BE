import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './order.model';
import { Notification } from '../notifications/notification.model';
import { OrderDetail } from '../order-details/order-detail.model';
import { Payment } from '../payments/payment.model';
import { Product } from '../products/product.model';
import { Discount } from '../discounts/discount.model';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from '../users/user.module';
import { RestaurantModule } from '../restaurants/restaurant.module';
import { AddressModule } from '../addresses/address.module';
import { DiscountModule } from '../discounts/discount.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Order,
      Notification,
      OrderDetail,
      Payment,
      Product,
      Discount,
    ]),
    UserModule,
    RestaurantModule,
    AddressModule,
    DiscountModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
