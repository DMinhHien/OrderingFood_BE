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
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreatePaymentDto })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({
    status: 200,
    description: 'List of all active payments',
  })
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get payments by order ID' })
  @ApiParam({ name: 'orderId', type: Number, description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'List of payments for the order',
  })
  findByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentService.findByOrder(orderId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Payment ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment found',
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a payment' })
  @ApiParam({ name: 'id', type: Number, description: 'Payment ID' })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiResponse({
    status: 200,
    description: 'Payment successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a payment (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Payment ID' })
  @ApiResponse({
    status: 204,
    description: 'Payment successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.remove(id);
  }
}
