import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('cart-items')
@Controller('cart-items')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
  @ApiBody({ type: CreateCartItemDto })
  create(@Body() dto: CreateCartItemDto) {
    return this.cartItemService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ cart items đang hoạt động' })
  findAll() {
    return this.cartItemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy cart item theo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tìm thấy cart item' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy cart item' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật cart item' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCartItemDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartItemService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa mềm cart item' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemService.remove(id);
  }

  @Get('cart/:cartId')
  @ApiOperation({ summary: 'Lấy tất cả cart items của một cart' })
  @ApiParam({ name: 'cartId', type: Number })
  findByCart(@Param('cartId', ParseIntPipe) cartId: number) {
    return this.cartItemService.findByCart(cartId);
  }

  @Get('cart/:cartId/product/:productId')
  @ApiOperation({
    summary:
      'Tìm cart item theo cartId và productId (bao gồm cả isActive = false)',
  })
  @ApiParam({ name: 'cartId', type: Number })
  @ApiParam({ name: 'productId', type: Number })
  findByCartAndProductAny(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartItemService.findByCartAndProductAny(cartId, productId);
  }
}
