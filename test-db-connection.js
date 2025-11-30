/**
 * Script để test kết nối database
 * Chạy: node test-db-connection.js
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const host = process.env.DB_HOST;
const port = process.env.DB_PORT || 5432;
const database = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const useSsl = process.env.DB_SSL === 'true';
const requiresSsl = useSsl || (host && host.includes('neon.tech'));

console.log('🔍 Testing Database Connection...\n');
console.log('Configuration:');
console.log('  Host:', host || '❌ MISSING');
console.log('  Port:', port);
console.log('  Database:', database || '❌ MISSING');
console.log('  Username:', username || '❌ MISSING');
console.log('  Password:', password ? '***' : '❌ MISSING');
console.log('  SSL Required:', requiresSsl);
console.log('\n');

if (!host || !database || !username || !password) {
  console.error('❌ ERROR: Missing required database configuration!');
  console.error('   Please check your .env file in the root directory.');
  process.exit(1);
}

const sequelize = new Sequelize(database, username, password, {
  host,
  port: Number(port),
  dialect: 'postgres',
  dialectOptions: requiresSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : undefined,
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection successful!');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

testConnection();
