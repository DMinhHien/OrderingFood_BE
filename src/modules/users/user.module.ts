import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleModule } from '../roles/role.module';
import { AddressModule } from '../addresses/address.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), RoleModule, AddressModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
