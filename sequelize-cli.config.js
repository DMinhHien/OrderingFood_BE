require('dotenv').config();

const {
  DB_DIALECT,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_SSL,
} = process.env;

// Kiểm tra xem có cần SSL không
const useSsl = DB_SSL === 'true';
const requiresSsl = useSsl || (DB_HOST && DB_HOST.includes('neon.tech'));

const common = {
  dialect: DB_DIALECT || 'postgres',
  host: DB_HOST || 'localhost',
  port: Number(DB_PORT) || 5432,
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  define: {
    underscored: false,
    freezeTableName: true,
  },
  dialectOptions: {
    useUTC: false,
    // Thêm cấu hình SSL nếu cần
    ...(requiresSsl && {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }),
  },
  timezone: '+00:00',
  logging: console.log,
};

module.exports = {
  development: { ...common },
  test: { ...common },
  production: { ...common },
};
