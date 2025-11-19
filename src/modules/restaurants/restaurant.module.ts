import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Restaurant } from './restaurant.model';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { CategoryModule } from '../categories/category.module';
import { UserModule } from '../users/user.module';
import { AddressModule } from '../addresses/address.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Restaurant]),
    CategoryModule,
    UserModule,
    AddressModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
