import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Menu } from './menu.model';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu)
    private readonly menuModel: typeof Menu,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    return this.menuModel.create({
      ...createMenuDto,
      isActive: createMenuDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<Menu[]> {
    return this.menuModel.findAll({
      where: { isActive: true },
      include: ['restaurant'],
    });
  }

  async findByRestaurant(restaurantId: number): Promise<Menu[]> {
    return this.menuModel.findAll({
      where: { restaurantID: restaurantId, isActive: true },
      include: ['restaurant'],
    });
  }

  async findOne(id: number): Promise<Menu> {
    const menu = await this.menuModel.findOne({
      where: { id, isActive: true },
      include: ['restaurant'],
    });

    if (!menu) {
      throw new NotFoundException(`Menu với ID ${id} không tồn tại`);
    }

    return menu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.findOne(id);
    await menu.update(updateMenuDto);
    return menu.reload();
  }

  async remove(id: number): Promise<void> {
    const menu = await this.findOne(id);
    await menu.update({ isActive: false });
  }
}
