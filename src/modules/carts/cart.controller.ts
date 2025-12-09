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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo giỏ hàng mới cho người dùng' })
  @ApiBody({ type: CreateCartDto })
  create(@Body() dto: CreateCartDto) {
    return this.cartService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy tất cả giỏ hàng đang hoạt động' })
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy chi tiết giỏ hàng theo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Giỏ hàng được tìm thấy' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy giỏ hàng' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật thông tin giỏ hàng' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCartDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCartDto) {
    return this.cartService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Vô hiệu hóa giỏ hàng' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy giỏ hàng active của user' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Giỏ hàng được tìm thấy' })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.findByUser(userId);
  }

  @Get('user/:userId/get-or-create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy hoặc tạo giỏ hàng active của user' })
  @ApiParam({ name: 'userId', type: Number })
  getOrCreateUserCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.getOrCreateUserCart(userId);
  }
}
