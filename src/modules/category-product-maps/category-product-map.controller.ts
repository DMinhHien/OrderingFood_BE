import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoryProductMapService } from './category-product-map.service';
import { CreateCategoryProductMapDto } from './dto/create-category-product-map.dto';
import { UpdateCategoryProductMapDto } from './dto/update-category-product-map.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('category-product-maps')
@Controller('category-product-maps')
export class CategoryProductMapController {
  constructor(
    private readonly categoryProductMapService: CategoryProductMapService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo liên kết sản phẩm - danh mục mới' })
  @ApiResponse({ status: 201, description: 'Liên kết tạo thành công' })
  @ApiBody({ type: CreateCategoryProductMapDto })
  create(@Body() createDto: CreateCategoryProductMapDto) {
    return this.categoryProductMapService.create(createDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy toàn bộ liên kết sản phẩm - danh mục' })
  @ApiResponse({ status: 200, description: 'Danh sách liên kết' })
  findAll() {
    return this.categoryProductMapService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xem chi tiết liên kết sản phẩm - danh mục' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Liên kết tìm thấy' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryProductMapService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật liên kết sản phẩm - danh mục' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCategoryProductMapDto })
  @ApiResponse({ status: 200, description: 'Liên kết cập nhật thành công' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCategoryProductMapDto,
  ) {
    return this.categoryProductMapService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa liên kết sản phẩm - danh mục' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Liên kết đã bị xóa' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryProductMapService.remove(id);
  }
}
