import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Order } from '../orders/order.model';
import { Feedback } from '../feedbacks/feedback.model';
import { Restaurant } from '../restaurants/restaurant.model';

@Injectable()
export class RestaurantDashboardService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(Feedback)
    private feedbackModel: typeof Feedback,
    @InjectModel(Restaurant)
    private restaurantModel: typeof Restaurant,
  ) {}

  async getRestaurantDashboardSummary(restaurantId: number) {
    const now = new Date();
    const todayRange = this.getDayRange(now);
    const yesterdayRange = this.getDayRange(this.addDays(now, -1));

    const baseOrderWhere = {
      restaurantId,
      [Op.or]: [{ isActive: true }, { isActive: null }],
    };

    const [
      ordersToday,
      ordersYesterday,
      revenueTodayRaw,
      revenueYesterdayRaw,
      restaurant,
      feedbackYesterday,
    ] = await Promise.all([
      this.orderModel.findAll({
        where: {
          ...baseOrderWhere,
          createdAt: {
            [Op.between]: [todayRange.start, todayRange.end],
          },
        },
        attributes: ['id', 'userId', 'createdAt'],
        raw: true,
      }),
      this.orderModel.findAll({
        where: {
          ...baseOrderWhere,
          createdAt: {
            [Op.between]: [yesterdayRange.start, yesterdayRange.end],
          },
        },
        attributes: ['id', 'userId', 'createdAt'],
        raw: true,
      }),
      this.orderModel.sum('totalPrice', {
        where: {
          ...baseOrderWhere,
          status: 4,
          updatedAt: {
            [Op.between]: [todayRange.start, todayRange.end],
          },
        },
      }),
      this.orderModel.sum('totalPrice', {
        where: {
          ...baseOrderWhere,
          status: 4,
          updatedAt: {
            [Op.between]: [yesterdayRange.start, yesterdayRange.end],
          },
        },
      }),
      this.restaurantModel.findByPk(restaurantId),
      this.feedbackModel.findAll({
        where: {
          isActive: true,
          createdAt: {
            [Op.between]: [yesterdayRange.start, yesterdayRange.end],
          },
        },
        include: [
          {
            association: 'order',
            required: true,
            where: { restaurantId },
          },
        ],
      }),
    ]);

    const ordersTodayCount = ordersToday.length;
    const ordersYesterdayCount = ordersYesterday.length;
    const revenueToday = Number(revenueTodayRaw || 0);
    const revenueYesterday = Number(revenueYesterdayRaw || 0);

    // Số khách đặt hôm nay
    const customersToday = this.countUniqueCustomers(ordersToday);
    const customersYesterday = this.countUniqueCustomers(ordersYesterday);

    // Debug log
    console.log(
      `[Dashboard] ordersToday=${ordersToday.length} customersToday=${customersToday} userIdsToday=${ordersToday
        .map((o) => o.userId)
        .join(',')}`,
    );

    const currentRating = Number(restaurant?.rating ?? 0);
    const previousRating =
      feedbackYesterday.length > 0
        ? Number(
            (
              feedbackYesterday.reduce(
                (sum, fb) => sum + Number(fb.rating || 0),
                0,
              ) / feedbackYesterday.length
            ).toFixed(2),
          )
        : 0;

    return {
      ordersToday: ordersTodayCount,
      ordersChange: this.calculatePercentageChange(
        ordersTodayCount,
        ordersYesterdayCount,
      ),
      revenueToday,
      revenueChange: this.calculatePercentageChange(
        revenueToday,
        revenueYesterday,
      ),
      rating: currentRating,
      ratingChange: this.calculatePercentageChange(
        currentRating,
        previousRating,
      ),
      customersToday,
      customersChange: this.calculatePercentageChange(
        customersToday,
        customersYesterday,
      ),
    };
  }

  private countUniqueCustomers(orders: { userId?: number | string | null }[]) {
    const customerSet = new Set(
      orders
        .map((order) => {
          const val = order.userId;
          if (typeof val === 'number') return val;
          if (typeof val === 'string') {
            const n = Number(val);
            return Number.isNaN(n) ? null : n;
          }
          return null;
        })
        .filter((id): id is number => typeof id === 'number'),
    );
    return customerSet.size;
  }

  private calculatePercentageChange(current: number, previous: number) {
    if (!Number.isFinite(previous) || previous === 0) {
      return current > 0 ? 100 : 0;
    }

    if (!Number.isFinite(current)) {
      return 0;
    }

    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  private getDayRange(date: Date) {
    // Mặc định dùng UTC+7 (VN), không cần biến môi trường
    const offsetMinutes = 420;
    const baseUtc = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    );
    const start = new Date(baseUtc - offsetMinutes * 60 * 1000);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
    return { start, end };
  }

  private addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
