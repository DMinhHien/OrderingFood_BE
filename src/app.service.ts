import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getTestInfo() {
    return {
      status: 'success',
      message: 'Backend đang hoạt động bình thường!',
      timestamp: new Date().toISOString(),
      server: 'Ordering Food API',
      version: '1.0.0',
      port: process.env.PORT || 5000,
    };
  }
}
