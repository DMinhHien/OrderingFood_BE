import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from '../users/user.model';
import { Restaurant } from '../restaurants/restaurant.model';

export interface SummaryStatistics {
  totalUsers: number;
  totalRestaurants: number;
}

export interface MonthlyStatisticsItem {
  month: number;
  users: number;
  restaurants: number;
}

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Restaurant)
    private restaurantModel: typeof Restaurant,
  ) {}

  /**
   * Lấy tổng số người dùng và nhà hàng
   */
  async getSummary(): Promise<SummaryStatistics> {
    const totalUsers = await this.userModel.count();
    const totalRestaurants = await this.restaurantModel.count();

    return {
      totalUsers,
      totalRestaurants,
    };
  }

  /**
   * Lấy thống kê theo từng tháng trong năm (tính tích lũy)
   * @param year Năm cần thống kê (ví dụ: 2025)
   */
  async getMonthlyStatistics(
    year: number,
  ): Promise<MonthlyStatisticsItem[]> {
    const monthlyData: MonthlyStatisticsItem[] = [];

    // Duyệt qua 12 tháng
    for (let month = 1; month <= 12; month++) {
      // Tính ngày cuối cùng của tháng đó
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

      // Đếm số users có createdAt <= cuối tháng đó
      const usersCount = await this.userModel.count({
        where: {
          createdAt: {
            [Op.lte]: endOfMonth,
          },
        },
      });

      // Đếm số restaurants có createdAt <= cuối tháng đó
      const restaurantsCount = await this.restaurantModel.count({
        where: {
          createdAt: {
            [Op.lte]: endOfMonth,
          },
        },
      });

      monthlyData.push({
        month,
        users: usersCount,
        restaurants: restaurantsCount,
      });
    }

    return monthlyData;
  }
}

