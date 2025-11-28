import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo giỏ hàng mới cho người dùng' })
  @ApiBody({ type: CreateCartDto })
  create(@Body() dto: CreateCartDto) {
    return this.cartService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả giỏ hàng đang hoạt động' })
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết giỏ hàng theo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Giỏ hàng được tìm thấy' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy giỏ hàng' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin giỏ hàng' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCartDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCartDto) {
    return this.cartService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Vô hiệu hóa giỏ hàng' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy giỏ hàng active của user' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Giỏ hàng được tìm thấy' })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.findByUser(userId);
  }

  @Get('user/:userId/get-or-create')
  @ApiOperation({ summary: 'Lấy hoặc tạo giỏ hàng active của user' })
  @ApiParam({ name: 'userId', type: Number })
  getOrCreateUserCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.getOrCreateUserCart(userId);
  }
}
