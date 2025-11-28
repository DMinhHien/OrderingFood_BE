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
      include: [
        'user',
        {
          association: 'items',
          where: { isActive: true },
          required: false,
        },
      ],
    });
  }

  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartModel.findOne({
      where: { id, isActive: true },
      include: [
        'user',
        {
          association: 'items',
          where: { isActive: true },
          required: false,
        },
      ],
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

  // Lấy cart active của user
  async findByUser(userId: number): Promise<Cart | null> {
    return this.cartModel.findOne({
      where: { userId, isActive: true, status: 'ACTIVE' },
      include: [
        'user',
        {
          association: 'items',
          where: { isActive: true },
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  // Tạo hoặc lấy cart active của user
  async getOrCreateUserCart(userId: number): Promise<Cart> {
    let cart = await this.findByUser(userId);

    if (!cart) {
      cart = await this.create({
        userId,
        status: 'ACTIVE',
        isActive: true,
      });
    }

    return this.findOne(cart.id);
  }
}
