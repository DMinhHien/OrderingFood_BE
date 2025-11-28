import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({
    status: 201,
    description: 'Restaurant successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateRestaurantDto })
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiResponse({
    status: 200,
    description: 'List of all active restaurants',
  })
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get('owner/:userId')
  @ApiOperation({ summary: 'Get restaurants owned by a user' })
  @ApiParam({ name: 'userId', type: Number, description: 'Owner user ID' })
  @ApiResponse({
    status: 200,
    description: 'List of restaurants for the given owner',
  })
  findByOwner(@Param('userId', ParseIntPipe) userId: number) {
    return this.restaurantService.findByOwner(userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm nhà hàng theo tên và category' })
  @ApiResponse({
    status: 200,
    description: 'List of restaurants matching search criteria',
  })
  search(
    @Query('q') query?: string,
    @Query('productCategoryIds') productCategoryIds?: string,
    @Query('restaurantCategoryIds') restaurantCategoryIds?: string,
  ) {
    const parsedProductIds = this.parseIds(productCategoryIds);
    const parsedRestaurantIds = this.parseIds(restaurantCategoryIds);
    return this.restaurantService.search(
      query,
      parsedProductIds,
      parsedRestaurantIds,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a restaurant by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Restaurant ID' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant found',
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a restaurant' })
  @ApiParam({ name: 'id', type: Number, description: 'Restaurant ID' })
  @ApiBody({ type: UpdateRestaurantDto })
  @ApiResponse({
    status: 200,
    description: 'Restaurant successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a restaurant (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Restaurant ID' })
  @ApiResponse({
    status: 204,
    description: 'Restaurant successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantService.remove(id);
  }

  private parseIds(value?: string): number[] | undefined {
    if (!value) {
      return undefined;
    }
    const ids = value
      .split(',')
      .map((id) => parseInt(id, 10))
      .filter((id) => !Number.isNaN(id));
    return ids.length > 0 ? ids : undefined;
  }
}
