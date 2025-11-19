import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Response } from './response.model';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { UserModule } from '../users/user.module';

@Module({
  imports: [SequelizeModule.forFeature([Response]), UserModule],
  controllers: [ResponseController],
  providers: [ResponseService],
  exports: [ResponseService],
})
export class ResponseModule {}
