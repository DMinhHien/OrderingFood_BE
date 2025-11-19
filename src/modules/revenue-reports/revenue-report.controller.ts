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
import { RevenueReportService } from './revenue-report.service';
import { CreateRevenueReportDto } from './dto/create-revenue-report.dto';
import { UpdateRevenueReportDto } from './dto/update-revenue-report.dto';

@ApiTags('revenue-reports')
@Controller('revenue-reports')
export class RevenueReportController {
  constructor(private readonly revenueReportService: RevenueReportService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new revenue report' })
  @ApiResponse({
    status: 201,
    description: 'Revenue report successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateRevenueReportDto })
  create(@Body() createRevenueReportDto: CreateRevenueReportDto) {
    return this.revenueReportService.create(createRevenueReportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all revenue reports' })
  @ApiResponse({
    status: 200,
    description: 'List of all active revenue reports',
  })
  findAll() {
    return this.revenueReportService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a revenue report by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Revenue report ID' })
  @ApiResponse({
    status: 200,
    description: 'Revenue report found',
  })
  @ApiResponse({ status: 404, description: 'Revenue report not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.revenueReportService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a revenue report' })
  @ApiParam({ name: 'id', type: Number, description: 'Revenue report ID' })
  @ApiBody({ type: UpdateRevenueReportDto })
  @ApiResponse({
    status: 200,
    description: 'Revenue report successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Revenue report not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRevenueReportDto: UpdateRevenueReportDto,
  ) {
    return this.revenueReportService.update(id, updateRevenueReportDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a revenue report (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Revenue report ID' })
  @ApiResponse({
    status: 204,
    description: 'Revenue report successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Revenue report not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.revenueReportService.remove(id);
  }
}
