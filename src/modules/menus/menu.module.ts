import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Menu } from './menu.model';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';

@Module({
  imports: [SequelizeModule.forFeature([Menu])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
