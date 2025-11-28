import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private readonly uploadPath: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    // Tạo thư mục uploads nếu chưa có
    this.uploadPath = path.join(process.cwd(), 'uploads', 'avatars');
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }

    // Lấy base URL từ config hoặc dùng mặc định
    const port = this.configService.get('PORT') || 5000;
    const host = this.configService.get('HOST') || 'localhost';
    this.baseUrl = `http://${host}:${port}`;
  }

  async saveAvatar(
    file: Express.Multer.File,
    requestBaseUrl?: string,
  ): Promise<string> {
    // Tạo tên file unique sử dụng crypto.randomUUID()
    const fileExtension = path.extname(file.originalname);
    const fileName = `${randomUUID()}${fileExtension}`;
    const filePath = path.join(this.uploadPath, fileName);

    // Lưu file
    fs.writeFileSync(filePath, file.buffer);

    // Sử dụng baseUrl từ request nếu có, nếu không dùng default
    const baseUrl = requestBaseUrl || this.baseUrl;

    // Trả về URL để truy cập file
    const fileUrl = `${baseUrl}/uploads/avatars/${fileName}`;
    return fileUrl;
  }
}
