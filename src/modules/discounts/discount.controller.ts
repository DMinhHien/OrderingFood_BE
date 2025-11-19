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
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@ApiTags('discounts')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new discount' })
  @ApiResponse({
    status: 201,
    description: 'Discount successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateDiscountDto })
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discounts' })
  @ApiResponse({
    status: 200,
    description: 'List of all active discounts',
  })
  findAll() {
    return this.discountService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a discount by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Discount ID' })
  @ApiResponse({
    status: 200,
    description: 'Discount found',
  })
  @ApiResponse({ status: 404, description: 'Discount not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.discountService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a discount' })
  @ApiParam({ name: 'id', type: Number, description: 'Discount ID' })
  @ApiBody({ type: UpdateDiscountDto })
  @ApiResponse({
    status: 200,
    description: 'Discount successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Discount not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a discount (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Discount ID' })
  @ApiResponse({
    status: 204,
    description: 'Discount successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Discount not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.discountService.remove(id);
  }
}
