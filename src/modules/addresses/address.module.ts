import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './address.model';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';

@Module({
  imports: [SequelizeModule.forFeature([Address])],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
