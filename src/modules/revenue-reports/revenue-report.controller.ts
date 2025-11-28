import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RevenuePeriod, RevenueReportService } from './revenue-report.service';

@ApiTags('revenue-reports')
@Controller('revenue-reports')
export class RevenueReportController {
  constructor(private readonly revenueReportService: RevenueReportService) {}

  @Get('restaurant/:restaurantId/summary')
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
}
