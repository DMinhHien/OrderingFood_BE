import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CartItem } from './cart-item.model';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Cart } from '../carts/cart.model';
import { Product } from '../products/product.model';

@Injectable()
export class CartItemService {
  constructor(
    @InjectModel(CartItem)
    private readonly cartItemModel: typeof CartItem,
    @InjectModel(Cart)
    private readonly cartModel: typeof Cart,
    @InjectModel(Product)
    private readonly productModel: typeof Product,
  ) {}

  private async ensureCart(cartId: number): Promise<Cart> {
    const cart = await this.cartModel.findOne({
      where: { id: cartId, isActive: true },
    });
    if (!cart) {
      throw new NotFoundException(`Cart với ID ${cartId} không tồn tại`);
    }
    return cart;
  }

  private async ensureProduct(productId: number): Promise<Product> {
    const product = await this.productModel.findOne({
      where: { id: productId, isActive: true },
    });
    if (!product) {
      throw new NotFoundException(
        `Sản phẩm với ID ${productId} không tồn tại hoặc đã bị vô hiệu hóa`,
      );
    }
    return product;
  }

  async create(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    await this.ensureCart(createCartItemDto.cartId);
    const product = await this.ensureProduct(createCartItemDto.productId);

    const item = await this.cartItemModel.create({
      ...createCartItemDto,
      quantity: createCartItemDto.quantity ?? 1,
      unitPrice: createCartItemDto.unitPrice ?? product.price,
      isActive: createCartItemDto.isActive ?? true,
    } as any);

    return this.findOne(item.id);
  }

  async findAll(): Promise<CartItem[]> {
    return this.cartItemModel.findAll({
      where: { isActive: true },
      include: ['cart', 'product'],
    });
  }

  async findOne(id: number): Promise<CartItem> {
    const item = await this.cartItemModel.findOne({
      where: { id, isActive: true },
      include: ['cart', 'product'],
    });

    if (!item) {
      throw new NotFoundException(`Cart item với ID ${id} không tồn tại`);
    }

    return item;
  }

  // Tìm cart item theo ID (bao gồm cả isActive = false)
  async findOneAny(id: number): Promise<CartItem> {
    const item = await this.cartItemModel.findOne({
      where: { id },
      include: ['cart', 'product'],
    });

    if (!item) {
      throw new NotFoundException(`Cart item với ID ${id} không tồn tại`);
    }

    return item;
  }

  async update(
    id: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    // Nếu đang cập nhật isActive = true, cần tìm item bao gồm cả isActive = false
    const shouldFindAny = updateCartItemDto.isActive === true;
    const item = shouldFindAny
      ? await this.findOneAny(id)
      : await this.findOne(id);

    if (updateCartItemDto.cartId) {
      await this.ensureCart(updateCartItemDto.cartId);
    }

    if (updateCartItemDto.productId) {
      await this.ensureProduct(updateCartItemDto.productId);
    }

    await item.update(updateCartItemDto);

    // Sau khi update, luôn tìm lại với isActive = true để trả về
    // Nếu item vẫn có isActive = false thì sẽ throw error (đúng behavior)
    if (updateCartItemDto.isActive === true) {
      return this.findOne(id);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await item.update({ isActive: false });
  }

  // Lấy tất cả cart items của một cart
  async findByCart(cartId: number): Promise<CartItem[]> {
    return this.cartItemModel.findAll({
      where: { cartId, isActive: true },
      include: [
        {
          association: 'product',
          include: ['categories', 'restaurant', 'menu'],
        },
        'cart',
      ],
      order: [['createdAt', 'ASC']],
    });
  }

  // Tìm cart item theo cartId và productId (để check xem đã có trong cart chưa)
  async findByCartAndProduct(
    cartId: number,
    productId: number,
  ): Promise<CartItem | null> {
    return this.cartItemModel.findOne({
      where: { cartId, productId, isActive: true },
      include: ['product', 'cart'],
    });
  }

  // Tìm cart item theo cartId và productId (bao gồm cả isActive = false)
  async findByCartAndProductAny(
    cartId: number,
    productId: number,
  ): Promise<CartItem | null> {
    return this.cartItemModel.findOne({
      where: { cartId, productId },
      include: ['product', 'cart'],
      order: [['createdAt', 'DESC']],
    });
  }
}
