import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RestaurantDashboardService } from './restaurant-dashboard.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('restaurant-dashboard')
@Controller('restaurant-dashboard')
export class RestaurantDashboardController {
  constructor(private readonly dashboardService: RestaurantDashboardService) {}

  @Get('restaurant/:restaurantId/summary')
  @Public() // Mọi role đều truy cập được
  @ApiOperation({
    summary: 'Get dashboard summary for a restaurant (today vs yesterday)',
  })
  @ApiParam({ name: 'restaurantId', type: Number })
  getRestaurantDashboardSummary(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ) {
    return this.dashboardService.getRestaurantDashboardSummary(restaurantId);
  }
}
