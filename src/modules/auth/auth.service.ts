import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async login(loginDto: LoginDto): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        email: loginDto.email,
        password: loginDto.password,
        isActive: true,
      },
      include: ['role', 'addresses'],
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    return user;
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
}
