// Script để generate JWT_SECRET ngẫu nhiên
const crypto = require('crypto');

// Tạo một secret key ngẫu nhiên, dài 64 ký tự
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('========================================');
console.log('JWT_SECRET được tạo tự động:');
console.log('========================================');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('========================================');
console.log('\nHãy copy dòng trên và thêm vào file .env của bạn!');
console.log('Hoặc chạy lệnh sau để tự động tạo file .env:');
console.log(`echo JWT_SECRET=${jwtSecret} >> .env`);
