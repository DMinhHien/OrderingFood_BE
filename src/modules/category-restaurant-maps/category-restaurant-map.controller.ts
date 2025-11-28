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
import { CategoryRestaurantMapService } from './category-restaurant-map.service';
import { CreateCategoryRestaurantMapDto } from './dto/create-category-restaurant-map.dto';
import { UpdateCategoryRestaurantMapDto } from './dto/update-category-restaurant-map.dto';

@ApiTags('category-restaurant-maps')
@Controller('category-restaurant-maps')
export class CategoryRestaurantMapController {
  constructor(
    private readonly categoryRestaurantMapService: CategoryRestaurantMapService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo liên kết nhà hàng - danh mục mới' })
  @ApiResponse({ status: 201, description: 'Liên kết tạo thành công' })
  @ApiBody({ type: CreateCategoryRestaurantMapDto })
  create(@Body() createDto: CreateCategoryRestaurantMapDto) {
    return this.categoryRestaurantMapService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ liên kết nhà hàng - danh mục' })
  @ApiResponse({ status: 200, description: 'Danh sách liên kết' })
  findAll() {
    return this.categoryRestaurantMapService.findAll();
  }

  @Get('restaurant/:restaurantId')
  @ApiOperation({
    summary: 'Lấy tất cả liên kết nhà hàng - danh mục theo restaurantId',
  })
  @ApiParam({ name: 'restaurantId', type: Number })
  @ApiResponse({ status: 200, description: 'Danh sách liên kết' })
  findByRestaurant(@Param('restaurantId', ParseIntPipe) restaurantId: number) {
    return this.categoryRestaurantMapService.findByRestaurant(restaurantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một liên kết nhà hàng - danh mục' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Liên kết tìm thấy' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryRestaurantMapService.findOne(id);
  }

  @Patch('restaurant/:restaurantId/category/:categoryId')
  @ApiOperation({
    summary: 'Cập nhật trạng thái isActive của liên kết nhà hàng - danh mục',
  })
  @ApiParam({ name: 'restaurantId', type: Number })
  @ApiParam({ name: 'categoryId', type: Number })
  @ApiBody({
    schema: { type: 'object', properties: { isActive: { type: 'boolean' } } },
  })
  @ApiResponse({ status: 200, description: 'Liên kết đã được cập nhật' })
  updateIsActive(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body('isActive') isActive: boolean,
  ) {
    return this.categoryRestaurantMapService.updateIsActive(
      restaurantId,
      categoryId,
      isActive,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật liên kết nhà hàng - danh mục' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCategoryRestaurantMapDto })
  @ApiResponse({ status: 200, description: 'Liên kết cập nhật thành công' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCategoryRestaurantMapDto,
  ) {
    return this.categoryRestaurantMapService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Vô hiệu hóa một liên kết nhà hàng - danh mục' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Liên kết đã bị vô hiệu hóa' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryRestaurantMapService.remove(id);
  }
}
