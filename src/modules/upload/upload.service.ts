import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private readonly uploadPath: string;

  constructor(private configService: ConfigService) {
    // Tạo thư mục uploads nếu chưa có
    this.uploadPath = path.join(process.cwd(), 'uploads', 'avatars');
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async saveAvatar(
    file: Express.Multer.File,
    // Giữ tham số để không phá vỡ interface, nhưng không dùng để tránh phụ thuộc IP
    // requestBaseUrl?: string,
  ): Promise<string> {
    // Tạo tên file unique sử dụng crypto.randomUUID()
    const fileExtension = path.extname(file.originalname);
    const fileName = `${randomUUID()}${fileExtension}`;
    const filePath = path.join(this.uploadPath, fileName);

    // Lưu file
    fs.writeFileSync(filePath, file.buffer);

    // Trả về đường dẫn TƯƠNG ĐỐI để truy cập file
    // Ví dụ: /uploads/avatars/<fileName>
    // Không chứa domain/IP để đảm bảo deploy trên nhiều máy vẫn dùng được
    const relativePath = `/uploads/avatars/${fileName}`;
    return relativePath;
  }
}
