import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { OrderJourneyService } from './order-journey.service';
import { CreateOrderJourneyDto } from './dto/create-order-journey.dto';
import { UpdateOrderJourneyDto } from './dto/update-order-journey.dto';

@ApiTags('order-journeys')
@Controller('order-journeys')
export class OrderJourneyController {
  constructor(private readonly service: OrderJourneyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order journey' })
  @ApiBody({ type: CreateOrderJourneyDto })
  @ApiResponse({ status: 201, description: 'Order journey created' })
  create(@Body() dto: CreateOrderJourneyDto) {
    console.log('Received DTO:', JSON.stringify(dto, null, 2));
    return this.service.create(dto);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get journeys by order' })
  @ApiParam({ name: 'orderId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of journeys for the order',
  })
  findByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.service.findByOrder(orderId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a journey by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Order journey found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order journey' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateOrderJourneyDto })
  @ApiResponse({ status: 200, description: 'Order journey updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderJourneyDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order journey' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Order journey deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }
}
