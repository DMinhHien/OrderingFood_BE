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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@ApiTags('menus')
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo menu mới cho nhà hàng' })
  @ApiBody({ type: CreateMenuDto })
  create(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả menu đang hoạt động' })
  findAll() {
    return this.menuService.findAll();
  }

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Lấy tất cả menu của một nhà hàng' })
  @ApiParam({ name: 'restaurantId', type: Number })
  findByRestaurant(@Param('restaurantId', ParseIntPipe) restaurantId: number) {
    return this.menuService.findByRestaurant(restaurantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy menu theo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tìm thấy menu' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy menu' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật menu' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateMenuDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMenuDto) {
    return this.menuService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Vô hiệu hoá menu' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}
