import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
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
import { RestaurantCategoryService } from './restaurant-category.service';
import { CreateRestaurantCategoryDto } from './dto/create-restaurant-category.dto';
import { UpdateRestaurantCategoryDto } from './dto/update-restaurant-category.dto';

@ApiTags('restaurant-categories')
@Controller('restaurant-categories')
export class RestaurantCategoryController {
  constructor(
    private readonly restaurantCategoryService: RestaurantCategoryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo danh mục nhà hàng mới' })
  @ApiBody({ type: CreateRestaurantCategoryDto })
  @ApiResponse({ status: 201, description: 'Tạo thành công' })
  create(@Body() dto: CreateRestaurantCategoryDto) {
    return this.restaurantCategoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả danh mục nhà hàng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách danh mục đang hoạt động',
  })
  findAll() {
    return this.restaurantCategoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy danh mục nhà hàng theo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID danh mục' })
  @ApiResponse({ status: 200, description: 'Tìm thấy danh mục' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantCategoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật danh mục nhà hàng' })
  @ApiParam({ name: 'id', type: Number, description: 'ID danh mục' })
  @ApiBody({ type: UpdateRestaurantCategoryDto })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRestaurantCategoryDto,
  ) {
    return this.restaurantCategoryService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Ngưng kích hoạt danh mục nhà hàng' })
  @ApiParam({ name: 'id', type: Number, description: 'ID danh mục' })
  @ApiResponse({ status: 204, description: 'Vô hiệu hóa thành công' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantCategoryService.remove(id);
  }
}
