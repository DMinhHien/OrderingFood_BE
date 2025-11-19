import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './notification.model';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UserModule } from '../users/user.module';
import { OrderModule } from '../orders/order.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Notification]),
    UserModule,
    OrderModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
