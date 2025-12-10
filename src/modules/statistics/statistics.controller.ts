import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get total number of users and restaurants' })
  @ApiResponse({
    status: 200,
    description: 'Summary statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalUsers: { type: 'number', example: 150 },
        totalRestaurants: { type: 'number', example: 25 },
      },
    },
  })
  getSummary() {
    return this.statisticsService.getSummary();
  }

  @Get('monthly')
  @ApiOperation({
    summary: 'Get monthly statistics of users and restaurants for a specific year',
  })
  @ApiQuery({
    name: 'year',
    type: Number,
    description: 'Year to get statistics (e.g., 2025)',
    example: 2025,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly statistics retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          month: { type: 'number', example: 1 },
          users: { type: 'number', example: 110 },
          restaurants: { type: 'number', example: 13 },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid year parameter',
  })
  getMonthlyStatistics(@Query('year', ParseIntPipe) year: number) {
    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 2000 || year > currentYear + 10) {
      throw new BadRequestException(
        `Year must be between 2000 and ${currentYear + 10}`,
      );
    }

    return this.statisticsService.getMonthlyStatistics(year);
  }
}

