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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { OrderDetailService } from './order-detail.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';

@ApiTags('order-details')
@Controller('order-details')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order detail' })
  @ApiResponse({
    status: 201,
    description: 'Order detail successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateOrderDetailDto })
  create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
    return this.orderDetailService.create(createOrderDetailDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all order details' })
  @ApiResponse({
    status: 200,
    description: 'List of all active order details',
  })
  findAll() {
    return this.orderDetailService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order detail by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Order detail ID' })
  @ApiResponse({
    status: 200,
    description: 'Order detail found',
  })
  @ApiResponse({ status: 404, description: 'Order detail not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderDetailService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order detail' })
  @ApiParam({ name: 'id', type: Number, description: 'Order detail ID' })
  @ApiBody({ type: UpdateOrderDetailDto })
  @ApiResponse({
    status: 200,
    description: 'Order detail successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Order detail not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    return this.orderDetailService.update(id, updateOrderDetailDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order detail (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Order detail ID' })
  @ApiResponse({
    status: 204,
    description: 'Order detail successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Order detail not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderDetailService.remove(id);
  }
}
