import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../users/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findOne({
      where: { id: payload.sub, isActive: true },
      include: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException(
        'Người dùng không tồn tại hoặc đã bị vô hiệu hóa',
      );
    }

    // Đảm bảo roleId được lấy đúng từ database
    const roleId = user.getDataValue('roleId') || user.roleId;

    console.log(
      `[JWT Strategy] User ${user.id} - roleId: ${roleId}, type: ${typeof roleId}`,
    );

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      roleId: roleId,
      role: user.role,
    };
  }
}
