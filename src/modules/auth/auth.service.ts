import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.model';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({
      where: {
        email: loginDto.email,
        isActive: true,
      },
      include: ['role', 'addresses'],
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // Kiểm tra password đã được hash chưa
    const isPasswordValid = await this.validatePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // Tạo JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roleId: user.roleId,
        phone: user.phone,
        gender: user.gender,
        avatar: user.avatar,
        role: user.role,
        addresses: user.addresses,
      },
    };
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // Nếu password chưa được hash (plain text), so sánh trực tiếp
    // Để tương thích với dữ liệu cũ
    if (
      !hashedPassword.startsWith('$2b$') &&
      !hashedPassword.startsWith('$2a$')
    ) {
      return plainPassword === hashedPassword;
    }

    // Nếu đã hash, dùng bcrypt để so sánh
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async findById(id: number): Promise<User> {
    const user = await this.userModel.findOne({
      where: { id, isActive: true },
      include: ['role', 'addresses'],
    });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
    }

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
