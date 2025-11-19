import { Module } from '@nestjs/common';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { sequelizeConfig } from './config/sequelize.config';
import { RoleModule } from './modules/roles/role.module';
import { CategoryModule } from './modules/categories/category.module';
import { AddressModule } from './modules/addresses/address.module';
import { UserModule } from './modules/users/user.module';
import { RestaurantModule } from './modules/restaurants/restaurant.module';
import { ProductModule } from './modules/products/product.module';
import { DiscountModule } from './modules/discounts/discount.module';
import { OrderModule } from './modules/orders/order.module';
import { OrderDetailModule } from './modules/order-details/order-detail.module';
import { PaymentModule } from './modules/payments/payment.module';
import { FeedbackModule } from './modules/feedbacks/feedback.module';
import { ResponseModule } from './modules/responses/response.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { RevenueReportModule } from './modules/revenue-reports/revenue-report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): SequelizeModuleOptions =>
        sequelizeConfig(configService),
    }),
    RoleModule,
    CategoryModule,
    AddressModule,
    UserModule,
    RestaurantModule,
    ProductModule,
    DiscountModule,
    OrderModule,
    OrderDetailModule,
    PaymentModule,
    FeedbackModule,
    ResponseModule,
    NotificationModule,
    RevenueReportModule,
  ],
})
export class AppModule {}
