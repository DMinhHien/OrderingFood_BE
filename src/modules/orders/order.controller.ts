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
  Request,
  ForbiddenException,
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
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Public() // Mọi role đều truy cập được
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
  @Public() // Mọi role đều truy cập được
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
  @Public() // Mọi role đều truy cập được
  @ApiOperation({ summary: 'Get orders by user' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'List of orders for the user',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('status') status?: string,
    @Request() req?: any,
  ) {
    // Kiểm tra user chỉ có thể xem orders của chính mình (role 1) hoặc restaurant owner (role 2) có thể xem orders của bất kỳ user nào
    const currentUser = req?.user;
    if (currentUser) {
      const currentUserId = currentUser.id;
      const currentUserRoleId = currentUser.roleId;

      console.log(
        `[Order Controller] findByUser - currentUserId: ${currentUserId}, userId: ${userId}, roleId: ${currentUserRoleId}`,
      );

      // Nếu không phải restaurant owner (role 2) và không phải chính user đó, thì không cho phép
      if (currentUserRoleId !== 2 && currentUserId !== userId) {
        throw new ForbiddenException(
          'Bạn không có quyền xem đơn hàng của người dùng khác',
        );
      }
    }
    const statusNumber = status ? parseInt(status, 10) : undefined;
    return this.orderService.findByUser(
      userId,
      Number.isNaN(statusNumber) ? undefined : statusNumber,
    );
  }

  @Get('restaurant/:restaurantId/orders')
  @Public() // Mọi role đều truy cập được
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
  @Public() // Mọi role đều truy cập được
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
  @Public() // Mọi role đều truy cập được
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
  @Public() // Mọi role đều truy cập được
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
