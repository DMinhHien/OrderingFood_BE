import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './order.model';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from '../users/user.module';
import { RestaurantModule } from '../restaurants/restaurant.module';
import { AddressModule } from '../addresses/address.module';
import { DiscountModule } from '../discounts/discount.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Order]),
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
