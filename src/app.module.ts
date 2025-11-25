import { Module } from '@nestjs/common';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { sequelizeConfig } from './config/sequelize.config';
import { DatabaseSyncService } from './config/database-sync.service';
import { User } from './modules/users/user.model';
import { RoleModule } from './modules/roles/role.module';
import { RestaurantCategoryModule } from './modules/restaurant-categories/restaurant-category.module';
import { AddressModule } from './modules/addresses/address.module';
import { UserModule } from './modules/users/user.module';
import { RestaurantModule } from './modules/restaurants/restaurant.module';
import { ProductModule } from './modules/products/product.module';
import { ProductCategoryModule } from './modules/product-categories/product-category.module';
import { MenuModule } from './modules/menus/menu.module';
import { DiscountModule } from './modules/discounts/discount.module';
import { OrderModule } from './modules/orders/order.module';
import { OrderDetailModule } from './modules/order-details/order-detail.module';
import { PaymentModule } from './modules/payments/payment.module';
import { FeedbackModule } from './modules/feedbacks/feedback.module';
import { ResponseModule } from './modules/responses/response.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { RevenueReportModule } from './modules/revenue-reports/revenue-report.module';
import { CartModule } from './modules/carts/cart.module';
import { CartItemModule } from './modules/cart-items/cart-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): SequelizeModuleOptions =>
        sequelizeConfig(configService),
    }),
    // Import User model vào AppModule để DatabaseSyncService có thể inject
    SequelizeModule.forFeature([User]),
    // Import UserModule trước để User model được register
    UserModule,
    RoleModule,
    RestaurantCategoryModule,
    AddressModule,
    RestaurantModule,
    MenuModule,
    ProductCategoryModule,
    ProductModule,
    DiscountModule,
    OrderModule,
    OrderDetailModule,
    PaymentModule,
    FeedbackModule,
    ResponseModule,
    NotificationModule,
    RevenueReportModule,
    CartModule,
    CartItemModule,
  ],
  providers: [DatabaseSyncService],
})
export class AppModule {}
