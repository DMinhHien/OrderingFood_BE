import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserAddress } from './user-address.model';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectModel(UserAddress)
    private readonly userAddressModel: typeof UserAddress,
  ) {}

  async create(
    createUserAddressDto: CreateUserAddressDto,
  ): Promise<UserAddress> {
    return this.userAddressModel.create({
      ...createUserAddressDto,
      isActive: createUserAddressDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<UserAddress[]> {
    return this.userAddressModel.findAll({
      where: { isActive: true },
      include: ['user', 'address'],
    });
  }

  async findByUser(userId: number): Promise<UserAddress[]> {
    return this.userAddressModel.findAll({
      where: { userId, isActive: true },
      include: ['user', 'address'],
    });
  }

  async findOne(id: number): Promise<UserAddress> {
    const link = await this.userAddressModel.findOne({
      where: { id, isActive: true },
      include: ['user', 'address'],
    });

    if (!link) {
      throw new NotFoundException(
        `User address link với ID ${id} không tồn tại`,
      );
    }

    return link;
  }

  async update(
    id: number,
    updateUserAddressDto: UpdateUserAddressDto,
  ): Promise<UserAddress> {
    const link = await this.findOne(id);
    await link.update(updateUserAddressDto);
    return link.reload();
  }

  async remove(id: number): Promise<void> {
    const link = await this.findOne(id);
    await link.update({ isActive: false });
  }
}
