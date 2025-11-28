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
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryProductMapService } from './category-product-map.service';
import { CreateCategoryProductMapDto } from './dto/create-category-product-map.dto';
import { UpdateCategoryProductMapDto } from './dto/update-category-product-map.dto';

@ApiTags('category-product-maps')
@Controller('category-product-maps')
export class CategoryProductMapController {
  constructor(
    private readonly categoryProductMapService: CategoryProductMapService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo liên kết sản phẩm - danh mục mới' })
  @ApiResponse({ status: 201, description: 'Liên kết tạo thành công' })
  @ApiBody({ type: CreateCategoryProductMapDto })
  create(@Body() createDto: CreateCategoryProductMapDto) {
    return this.categoryProductMapService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ liên kết sản phẩm - danh mục' })
  @ApiResponse({ status: 200, description: 'Danh sách liên kết' })
  findAll() {
    return this.categoryProductMapService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết liên kết sản phẩm - danh mục' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Liên kết tìm thấy' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryProductMapService.findOne(id);
  }

  @Patch(':id')
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa liên kết sản phẩm - danh mục' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Liên kết đã bị xóa' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryProductMapService.remove(id);
  }
}
