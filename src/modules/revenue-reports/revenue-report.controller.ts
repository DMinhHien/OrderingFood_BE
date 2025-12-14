import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RevenuePeriod, RevenueReportService } from './revenue-report.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('revenue-reports')
@Controller('revenue-reports')
export class RevenueReportController {
  constructor(private readonly revenueReportService: RevenueReportService) {}

  @Get('restaurant/:restaurantId/summary')
  @Public() // Mọi role đều truy cập được
  @ApiOperation({ summary: 'Get revenue summary for a restaurant' })
  @ApiParam({
    name: 'restaurantId',
    type: Number,
    description: 'Restaurant ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Revenue summary data',
  })
  getRevenueSummary(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Query('period') period: string = 'today',
  ) {
    const allowedPeriods: RevenuePeriod[] = ['today', 'week', 'month', 'year'];
    const normalizedPeriod = allowedPeriods.includes(period as RevenuePeriod)
      ? (period as RevenuePeriod)
      : 'today';
    return this.revenueReportService.getRestaurantRevenueSummary(
      restaurantId,
      normalizedPeriod,
    );
  }

  @Get('restaurant/:restaurantId/monthly/:year')
  @Public() // Mọi role đều truy cập được
  @ApiOperation({
    summary: 'Get monthly revenue for a restaurant by year',
    description:
      'Trả về mảng 12 phần tử, mỗi phần tử chứa tháng (1-12) và doanh thu của tháng đó trong năm được chỉ định',
  })
  @ApiParam({
    name: 'restaurantId',
    type: Number,
    description: 'Restaurant ID',
  })
  @ApiParam({
    name: 'year',
    type: Number,
    description: 'Năm cần lấy doanh thu (ví dụ: 2024)',
  })
  @ApiResponse({
    status: 200,
    description: 'Mảng doanh thu theo tháng trong năm',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          month: { type: 'number', description: 'Tháng (1-12)' },
          revenue: { type: 'number', description: 'Doanh thu của tháng' },
        },
      },
      example: [
        { month: 1, revenue: 5000000 },
        { month: 2, revenue: 6000000 },
        { month: 3, revenue: 4500000 },
        // ... các tháng còn lại
      ],
    },
  })
  getMonthlyRevenueByYear(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.revenueReportService.getMonthlyRevenueByYear(
      restaurantId,
      year,
    );
  }
}
