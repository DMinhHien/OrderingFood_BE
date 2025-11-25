import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartItem } from './cart-item.model';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { Cart } from '../carts/cart.model';
import { Product } from '../products/product.model';

@Module({
  imports: [SequelizeModule.forFeature([CartItem, Cart, Product])],
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
