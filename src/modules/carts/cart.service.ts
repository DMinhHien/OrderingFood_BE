import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './cart.model';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart)
    private readonly cartModel: typeof Cart,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const cart = await this.cartModel.create({
      ...createCartDto,
      status: createCartDto.status ?? 'ACTIVE',
      isActive: createCartDto.isActive ?? true,
    } as any);

    return this.findOne(cart.id);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartModel.findAll({
      where: { isActive: true },
      include: ['user', 'items'],
    });
  }

  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartModel.findOne({
      where: { id, isActive: true },
      include: ['user', 'items'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart với ID ${id} không tồn tại`);
    }

    return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(id);
    await cart.update(updateCartDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const cart = await this.findOne(id);
    await cart.update({ isActive: false });
  }
}
