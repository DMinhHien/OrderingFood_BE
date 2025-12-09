import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransferInformationService } from './transfer-information.service';
import { TransferInformationController } from './transfer-information.controller';
import { TransferInformation } from './transfer-information.model';
import { User } from '../users/user.model';

@Module({
  imports: [SequelizeModule.forFeature([TransferInformation, User])],
  controllers: [TransferInformationController],
  providers: [TransferInformationService],
  exports: [TransferInformationService],
})
export class TransferInformationModule {}
