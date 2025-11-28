import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Order } from '../orders/order.model';
import { OrderDetail } from '../order-details/order-detail.model';
import { Menu } from '../menus/menu.model';

export type RevenuePeriod = 'today' | 'week' | 'month' | 'year';

@Injectable()
export class RevenueReportService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderDetail)
    private orderDetailModel: typeof OrderDetail,
    @InjectModel(Menu)
    private menuModel: typeof Menu,
  ) {}

  async getRestaurantRevenueSummary(
    restaurantId: number,
    period: RevenuePeriod,
  ) {
    const {
      currentStart,
      currentEnd,
      previousStart,
      previousEnd,
      comparisonLabel,
    } = this.getPeriodRange(period);

    const baseWhere = {
      restaurantId,
      isActive: true,
      status: 4,
    };

    const [
      currentOrders,
      totalRevenueRaw,
      previousRevenueRaw,
      restaurantMenus,
    ] = await Promise.all([
      this.orderModel.findAll({
        where: {
          ...baseWhere,
          updatedAt: {
            [Op.between]: [currentStart, currentEnd],
          },
        },
        include: [
          {
            association: 'orderDetails',
            required: false,
            include: [
              {
                association: 'product',
                required: false,
                include: ['menu'],
              },
            ],
          },
        ],
      }),
      this.orderModel.sum('totalPrice', {
        where: {
          ...baseWhere,
          updatedAt: {
            [Op.between]: [currentStart, currentEnd],
          },
        },
      }),
      this.orderModel.sum('totalPrice', {
        where: {
          ...baseWhere,
          updatedAt: {
            [Op.between]: [previousStart, previousEnd],
          },
        },
      }),
      this.menuModel.findAll({
        where: {
          restaurantID: restaurantId,
          isActive: true,
        },
      }),
    ]);

    const totalRevenue = Number(totalRevenueRaw || 0);
    const totalOrders = currentOrders.length;
    const averageOrderValue =
      totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const previousRevenue = Number(previousRevenueRaw || 0);
    const growthRate =
      previousRevenue > 0
        ? Number(
            (
              ((totalRevenue - previousRevenue) / previousRevenue) *
              100
            ).toFixed(1),
          )
        : totalRevenue > 0
          ? 100
          : 0;

    const orderIds = currentOrders.map((order) => order.id);
    let currentOrderDetails: OrderDetail[] = [];
    if (orderIds.length > 0) {
      currentOrderDetails = await this.orderDetailModel.findAll({
        where: {
          orderId: { [Op.in]: orderIds },
        },
        include: [
          {
            association: 'product',
            required: true,
            include: ['menu'],
          },
        ],
      });
      // ensure plain objects
      currentOrderDetails = currentOrderDetails.map((detail) =>
        detail.get ? detail.get({ plain: true }) : detail,
      );
    }

    const plainOrders = currentOrders.map((order) =>
      typeof (order as any).get === 'function'
        ? (order as any).get({ plain: true })
        : order,
    );

    const chartData =
      period === 'today'
        ? []
        : this.buildChartData(plainOrders, [
            'T2',
            'T3',
            'T4',
            'T5',
            'T6',
            'T7',
            'CN',
          ]);

    const topProducts = this.getTopProducts(currentOrderDetails);
    const menuRevenue = this.getMenuRevenue(
      currentOrderDetails,
      restaurantMenus,
    );

    return {
      period,
      comparisonLabel,
      totalRevenue,
      totalOrders,
      averageOrderValue,
      growthRate,
      chart: chartData,
      topProducts,
      menuRevenue,
    };
  }

  private getTopProducts(orderDetails: OrderDetail[]) {
    const productMap = new Map<
      number,
      {
        productId: number;
        name: string;
        quantity: number;
        revenue: number;
        imageUrl?: string | null;
      }
    >();

    for (const detail of orderDetails) {
      if (!detail.product) continue;
      // detail.product có thể là instance Sequelize nên dùng get
      const product: any =
        typeof detail.product.get === 'function'
          ? detail.product.get({ plain: true })
          : detail.product;
      if (!product || product.isActive === false) continue;

      const productId = product.id;
      const quantity = Number(detail.quantity || 0);
      const price = Number(product.price || 0);
      if (!productMap.has(productId)) {
        productMap.set(productId, {
          productId,
          name: product.name ?? `Sản phẩm #${productId}`,
          quantity: 0,
          revenue: 0,
          imageUrl: product.imageUrl || null,
        });
      }
      const entry = productMap.get(productId)!;
      entry.quantity += quantity;
      entry.revenue += quantity * price;
    }

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }

  private getMenuRevenue(orderDetails: OrderDetail[], menus: Menu[] = []) {
    const menuMap = new Map<
      string,
      { menuId: number | null; menuName: string; revenue: number }
    >();

    menus.forEach((menu) => {
      const plain: any =
        typeof menu.get === 'function' ? menu.get({ plain: true }) : menu;
      menuMap.set(`menu-${plain.id}`, {
        menuId: plain.id,
        menuName: plain.name ?? `Menu #${plain.id}`,
        revenue: 0,
      });
    });

    for (const detail of orderDetails) {
      if (!detail.product) continue;
      const product: any =
        typeof detail.product.get === 'function'
          ? detail.product.get({ plain: true })
          : detail.product;
      if (!product || product.isActive === false) continue;
      const menuId = product.menuID ?? null;
      const menuName =
        menuId !== null
          ? menuMap.get(`menu-${menuId}`)?.menuName ||
            product.menu?.name ||
            'Khác'
          : 'Khác';
      const key = menuId !== null ? `menu-${menuId}` : 'menu-null';
      if (!menuMap.has(key)) {
        menuMap.set(key, {
          menuId,
          menuName,
          revenue: 0,
        });
      }
      const entry = menuMap.get(key)!;
      const quantity = Number(detail.quantity || 0);
      const price = Number(detail.product.price || 0);
      entry.revenue += quantity * price;
    }

    return Array.from(menuMap.values()).sort((a, b) => b.revenue - a.revenue);
  }

  private buildChartData(orders: any[], labels: string[]) {
    const totals = labels.reduce(
      (acc, label) => acc.set(label, 0),
      new Map<string, number>(),
    );

    orders.forEach((order) => {
      const date = new Date(order.updatedAt || order.createdAt);
      const weekdayIndex = (date.getDay() + 6) % 7; // Monday-first
      const label = labels[weekdayIndex];
      totals.set(
        label,
        (totals.get(label) || 0) + Number(order.totalPrice || 0),
      );
    });

    return labels.map((label) => ({
      label,
      revenue: totals.get(label) || 0,
    }));
  }

  private getPeriodRange(period: RevenuePeriod) {
    const now = new Date();
    switch (period) {
      case 'week':
        return this.getWeekRange(now);
      case 'month':
        return this.getMonthRange(now);
      case 'year':
        return this.getYearRange(now);
      case 'today':
      default:
        return this.getTodayRange(now);
    }
  }

  private getTodayRange(now: Date) {
    const start = this.startOfDay(now);
    const end = this.endOfDay(now);
    const prevStart = this.addDays(start, -1);
    const prevEnd = this.addDays(end, -1);
    return {
      currentStart: start,
      currentEnd: end,
      previousStart: prevStart,
      previousEnd: prevEnd,
      comparisonLabel: 'so với hôm qua',
    };
  }

  private getWeekRange(now: Date) {
    const dayIndex = (now.getDay() + 6) % 7;
    const start = this.startOfDay(this.addDays(now, -dayIndex));
    const end = this.endOfDay(this.addDays(start, 6));
    const prevStart = this.addDays(start, -7);
    const prevEnd = this.addDays(end, -7);
    return {
      currentStart: start,
      currentEnd: end,
      previousStart: prevStart,
      previousEnd: prevEnd,
      comparisonLabel: 'so với tuần trước',
    };
  }

  private getMonthRange(now: Date) {
    const start = this.startOfDay(
      new Date(now.getFullYear(), now.getMonth(), 1),
    );
    const end = this.endOfDay(
      new Date(now.getFullYear(), now.getMonth() + 1, 0),
    );
    const prevStart = this.startOfDay(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
    );
    const prevEnd = this.endOfDay(
      new Date(now.getFullYear(), now.getMonth(), 0),
    );
    return {
      currentStart: start,
      currentEnd: end,
      previousStart: prevStart,
      previousEnd: prevEnd,
      comparisonLabel: 'so với tháng trước',
    };
  }

  private getYearRange(now: Date) {
    const start = this.startOfDay(new Date(now.getFullYear(), 0, 1));
    const end = this.endOfDay(new Date(now.getFullYear(), 11, 31));
    const prevStart = this.startOfDay(new Date(now.getFullYear() - 1, 0, 1));
    const prevEnd = this.endOfDay(new Date(now.getFullYear() - 1, 11, 31));
    return {
      currentStart: start,
      currentEnd: end,
      previousStart: prevStart,
      previousEnd: prevEnd,
      comparisonLabel: 'so với năm trước',
    };
  }

  private startOfDay(date: Date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  private endOfDay(date: Date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  private addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
