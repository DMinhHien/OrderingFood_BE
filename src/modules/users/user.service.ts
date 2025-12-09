import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password nếu có
    const hashedPassword = createUserDto.password
      ? await this.hashPassword(createUserDto.password)
      : createUserDto.password;

    return this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      isActive: createUserDto.isActive ?? true,
    } as any);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      where: { isActive: true },
      include: [
        'role',
        {
          association: 'addresses',
          required: false,
        },
      ],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findOne({
      where: { id, isActive: true },
      include: [
        'role',
        {
          association: 'addresses',
          required: false,
        },
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Check if email is being updated and if it already exists (exclude current user)
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({
        where: {
          email: updateUserDto.email,
          id: { [Op.ne]: id },
        },
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }

    // Hash password nếu có trong updateUserDto
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    await user.update(updateUserDto);
    return user.reload();
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await user.update({ isActive: false });
  }
}
