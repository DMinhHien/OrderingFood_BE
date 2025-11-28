import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize/lib/sequelize';

export const sequelizeConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  database: configService.get<string>('DB_NAME'),
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT') || 5432,
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  dialect: configService.get<string>('DB_DIALECT') as Dialect,
  autoLoadModels: true,
  synchronize: true,
  logging: false, // Tắt logging SQL queries để tránh log lặp lại
  sync:
    configService.get<string>('DB_SYNC_ALTER') === 'true'
      ? { alter: true }
      : undefined,
});
