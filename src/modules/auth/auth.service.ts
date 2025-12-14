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
    // Tìm user theo email (không filter isActive để debug)
    // Sử dụng raw: false để đảm bảo lấy dữ liệu mới nhất từ DB
    const user = await this.userModel.findOne({
      where: {
        email: loginDto.email,
      },
      include: ['role', 'addresses'],
      raw: false, // Đảm bảo trả về Model instance, không phải plain object
    });

    // Reload user từ database để đảm bảo dữ liệu mới nhất
    if (user) {
      await user.reload();
    }

    if (!user) {
      console.log(`[Auth] User not found with email: ${loginDto.email}`);
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // Lấy giá trị từ database bằng getDataValue() vì Sequelize model có thể không expose trực tiếp
    const isActiveRaw: any = user.getDataValue('isActive');
    const passwordFromDb: string | null = user.getDataValue('password');

    console.log(`[Auth] User ${user.id} - isActive raw:`, isActiveRaw);
    console.log(`[Auth] User ${user.id} - password exists:`, !!passwordFromDb);

    // Kiểm tra isActive (có thể là boolean hoặc number 0/1)
    let isActive = false;

    if (typeof isActiveRaw === 'boolean') {
      isActive = isActiveRaw === true;
    } else if (typeof isActiveRaw === 'number') {
      isActive = isActiveRaw === 1;
    } else if (typeof isActiveRaw === 'string') {
      isActive = isActiveRaw === 'true' || isActiveRaw === '1';
    }

    if (!isActive) {
      console.log(`[Auth] User ${user.id} is not active`);
      throw new UnauthorizedException('Tài khoản của bạn đã bị vô hiệu hóa');
    }

    // Kiểm tra password đã được hash chưa
    console.log(`[Auth] Validating password for user ${user.id}`);
    if (passwordFromDb) {
      console.log(
        `[Auth] Password from DB (first 10 chars): ${passwordFromDb.substring(0, 10)}...`,
      );
    }
    const isPasswordValid = await this.validatePassword(
      loginDto.password,
      passwordFromDb,
    );

    console.log(`[Auth] Password validation result: ${isPasswordValid}`);

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

    // Lấy các giá trị từ database bằng getDataValue() để tránh vấn đề Sequelize model
    const userId = user.getDataValue('id');
    const userEmail = user.getDataValue('email');
    const username = user.getDataValue('username');
    const roleId = user.getDataValue('roleId');
    const phone = user.getDataValue('phone');
    const gender = user.getDataValue('gender');
    const avatar = user.getDataValue('avatar');

    console.log(
      `[Auth] Returning user data - roleId: ${roleId}, type: ${typeof roleId}`,
    );

    return {
      accessToken,
      user: {
        id: userId,
        email: userEmail,
        username: username,
        roleId: roleId,
        phone: phone ?? undefined,
        gender: gender ?? undefined,
        avatar: avatar ?? undefined,
        role: user.role,
        addresses: user.addresses,
      },
    };
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string | null | undefined,
  ): Promise<boolean> {
    // Kiểm tra null/undefined
    if (!hashedPassword) {
      console.log('[Auth] Password is null or undefined');
      return false;
    }

    // Nếu password chưa được hash (plain text), so sánh trực tiếp
    // Để tương thích với dữ liệu cũ
    const isHashed =
      hashedPassword.startsWith('$2b$') || hashedPassword.startsWith('$2a$');

    if (!isHashed) {
      // Plain text comparison
      const isValid = plainPassword === hashedPassword;
      console.log(`[Auth] Plain text comparison: ${isValid}`);
      return isValid;
    }

    // Nếu đã hash, dùng bcrypt để so sánh
    try {
      const isValid = await bcrypt.compare(plainPassword, hashedPassword);
      console.log(`[Auth] Bcrypt comparison: ${isValid}`);
      return isValid;
    } catch (error) {
      console.error('[Auth] Error comparing password with bcrypt:', error);
      return false;
    }
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
