import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './role.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private roleModel: typeof Role,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleModel.create({
      ...createRoleDto,
      isActive: createRoleDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.findAll({
      where: { isActive: true },
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleModel.findOne({
      where: { id, isActive: true },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    await role.update(updateRoleDto);
    return role.reload();
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await role.update({ isActive: false });
  }
}
