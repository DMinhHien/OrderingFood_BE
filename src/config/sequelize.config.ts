import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';

export const sequelizeConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => {
  const dialect = (configService.get<string>('DB_DIALECT') ||
    'postgres') as Dialect;

  const host = configService.get<string>('DB_HOST');
  const port = Number(configService.get<string>('DB_PORT')) || 5432;
  const database = configService.get<string>('DB_NAME');
  const username = configService.get<string>('DB_USERNAME');
  const password = configService.get<string>('DB_PASSWORD');
  const useSsl = configService.get<string>('DB_SSL') === 'true';

  // Neon và các cloud PostgreSQL khác yêu cầu SSL
  // Tự động bật SSL nếu host chứa 'neon.tech' hoặc DB_SSL=true
  const requiresSsl = useSsl || (host && host.includes('neon.tech'));

  // Debug logging - kiểm tra các biến env có được đọc đúng không
  console.log('🔍 Database Config Debug:');
  console.log('  Host:', host || '❌ MISSING');
  console.log('  Port:', port);
  console.log('  Database:', database || '❌ MISSING');
  console.log('  Username:', username || '❌ MISSING');
  console.log('  Password:', password ? '***' : '❌ MISSING');
  console.log('  SSL Required:', requiresSsl);
  console.log('  Dialect:', dialect);

  if (!host || !database || !username || !password) {
    console.error('❌ ERROR: Missing required database configuration!');
    console.error('   Please check your .env file in the root directory.');
  }

  return {
    database,
    host,
    port,
    username,
    password,
    dialect,
    autoLoadModels: true,
    synchronize: true,
    logging: false, // Tắt logging SQL queries để tránh log lặp lại
    sync:
      configService.get<string>('DB_SYNC_ALTER') === 'true'
        ? { alter: true }
        : undefined,
    dialectOptions: requiresSsl
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : undefined,
    // Connection pool settings cho Neon và các cloud databases
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // Retry logic cho connection
    retry: {
      max: 3,
    },
  };
};
