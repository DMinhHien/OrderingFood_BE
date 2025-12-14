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
import { RestaurantCategoryService } from './restaurant-category.service';
import { CreateRestaurantCategoryDto } from './dto/create-restaurant-category.dto';
import { UpdateRestaurantCategoryDto } from './dto/update-restaurant-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('restaurant-categories')
@Controller('restaurant-categories')
export class RestaurantCategoryController {
  constructor(
    private readonly restaurantCategoryService: RestaurantCategoryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3) // Chỉ admin (roleId = 3)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo danh mục nhà hàng mới' })
  @ApiBody({ type: CreateRestaurantCategoryDto })
  @ApiResponse({ status: 201, description: 'Tạo thành công' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() dto: CreateRestaurantCategoryDto) {
    return this.restaurantCategoryService.create(dto);
  }

  @Get()
  @Public() // Mọi role đều truy cập được
  @ApiOperation({ summary: 'Lấy tất cả danh mục nhà hàng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách danh mục đang hoạt động',
  })
  findAll() {
    return this.restaurantCategoryService.findAll();
  }

  @Get(':id')
  @Public() // Mọi role đều truy cập được
  @ApiOperation({ summary: 'Lấy danh mục nhà hàng theo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID danh mục' })
  @ApiResponse({ status: 200, description: 'Tìm thấy danh mục' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantCategoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3) // Chỉ admin (roleId = 3)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật danh mục nhà hàng' })
  @ApiParam({ name: 'id', type: Number, description: 'ID danh mục' })
  @ApiBody({ type: UpdateRestaurantCategoryDto })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRestaurantCategoryDto,
  ) {
    return this.restaurantCategoryService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3) // Chỉ admin (roleId = 3)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Ngưng kích hoạt danh mục nhà hàng' })
  @ApiParam({ name: 'id', type: Number, description: 'ID danh mục' })
  @ApiResponse({ status: 204, description: 'Vô hiệu hóa thành công' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantCategoryService.remove(id);
  }
}
