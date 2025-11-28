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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all active products',
  })
  findAll() {
    return this.productService.findAll();
  }

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Lấy tất cả sản phẩm của một nhà hàng' })
  @ApiParam({ name: 'restaurantId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of products for the restaurant',
  })
  findByRestaurant(@Param('restaurantId', ParseIntPipe) restaurantId: number) {
    return this.productService.findByRestaurant(restaurantId);
  }

  @Get('popular')
  @ApiOperation({
    summary: 'Lấy top 5 sản phẩm phổ biến nhất (có nhiều order nhất)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of popular products',
  })
  findPopular() {
    return this.productService.findPopularProducts(5);
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm sản phẩm theo tên và category' })
  @ApiResponse({
    status: 200,
    description: 'List of products matching search criteria',
  })
  search(
    @Query('q') query?: string,
    @Query('categoryIds') categoryIds?: string,
  ) {
    const parsedIds = this.parseIds(categoryIds);
    return this.productService.search(query, parsedIds);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product found',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiResponse({
    status: 204,
    description: 'Product successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
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
