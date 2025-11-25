require('dotenv').config();

const { DB_DIALECT, DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } =
  process.env;

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
  },
  timezone: '+00:00',
  logging: console.log,
};

module.exports = {
  development: { ...common },
  test: { ...common },
  production: { ...common },
};
