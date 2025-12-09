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
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(2, 3) // Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({
    status: 201,
    description: 'Restaurant successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only restaurant owners can create restaurants',
  })
  @ApiBody({ type: CreateRestaurantDto })
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiResponse({
    status: 200,
    description: 'List of all active restaurants',
  })
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get('owner/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get restaurants owned by a user' })
  @ApiParam({ name: 'userId', type: Number, description: 'Owner user ID' })
  @ApiResponse({
    status: 200,
    description: 'List of restaurants for the given owner',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByOwner(@Param('userId', ParseIntPipe) userId: number) {
    return this.restaurantService.findByOwner(userId);
  }

  @Get('search')
  @Public()
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
  @Public()
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(2, 3) // Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a restaurant' })
  @ApiParam({ name: 'id', type: Number, description: 'Restaurant ID' })
  @ApiBody({ type: UpdateRestaurantDto })
  @ApiResponse({
    status: 200,
    description: 'Restaurant successfully updated',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(2, 3) // Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a restaurant (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Restaurant ID' })
  @ApiResponse({
    status: 204,
    description: 'Restaurant successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
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
