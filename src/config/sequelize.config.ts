import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';

export const sequelizeConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => {
  const dialect = (configService.get<string>('DB_DIALECT') ||
    'postgres') as Dialect;

  const useSsl = configService.get<string>('DB_SSL') === 'true';

  return {
    database: configService.get<string>('DB_NAME'),
    host: configService.get<string>('DB_HOST'),
    port: Number(configService.get<string>('DB_PORT')) || 5432,
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    dialect,
    autoLoadModels: true,
    synchronize: true,
    logging: false, // Tắt logging SQL queries để tránh log lặp lại
    sync:
      configService.get<string>('DB_SYNC_ALTER') === 'true'
        ? { alter: true }
        : undefined,
    dialectOptions: useSsl
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : undefined,
  };
};
