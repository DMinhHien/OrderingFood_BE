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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1) // Chỉ client (role 1) mới được tạo order
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({ type: CreateOrderDto })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2) // Client và restaurant owner đều xem được
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'List of all active orders',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.orderService.findAll();
  }

  @Get('user/:userId/orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get orders by user' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'List of orders for the user',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('status') status?: string,
  ) {
    const statusNumber = status ? parseInt(status, 10) : undefined;
    return this.orderService.findByUser(
      userId,
      Number.isNaN(statusNumber) ? undefined : statusNumber,
    );
  }

  @Get('restaurant/:restaurantId/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(2) // Chỉ restaurant owner mới xem được orders của nhà hàng
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get orders by restaurant' })
  @ApiParam({
    name: 'restaurantId',
    type: Number,
    description: 'Restaurant ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of orders for the restaurant',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findByRestaurant(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Query('status') status?: string,
  ) {
    const statusNumber = status ? parseInt(status, 10) : undefined;
    return this.orderService.findByRestaurant(
      restaurantId,
      Number.isNaN(statusNumber) ? undefined : statusNumber,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2) // Client và restaurant owner đều có thể update order
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'id', type: Number, description: 'Order ID' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Order successfully updated',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2) // Client và restaurant owner đều có thể xóa order
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Order ID' })
  @ApiResponse({
    status: 204,
    description: 'Order successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }
}
