import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { plainToInstance } from 'class-transformer';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

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

    return this.userModel.create({
      ...createUserDto,
      isActive: createUserDto.isActive ?? true,
    } as any);
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

  // Get all users including inactive ones
  async findAllIncludingInactive(): Promise<UserResponseDto[]> {
    const users = await this.userModel.findAll({
      include: [
        'role',
        {
          association: 'addresses',
          required: false,
        },
      ],
    });

    return plainToInstance(UserResponseDto, users.map(user => user.get({ plain: true })), {
      excludeExtraneousValues: true,
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

    await user.update(updateUserDto);
    return user.reload();
  }

  async updateStatus(id: number, isActive: boolean): Promise<User> {
    console.log("getting user")
    const user = await this.userModel.findOne({ where: { id } });
    console.log("user", user);
    await user?.update({ isActive });
    if (user) {
      return user.reload();
    } else {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
