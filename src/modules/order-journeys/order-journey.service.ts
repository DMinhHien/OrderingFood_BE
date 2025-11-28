import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderJourney } from './order-journey.model';
import { CreateOrderJourneyDto } from './dto/create-order-journey.dto';
import { UpdateOrderJourneyDto } from './dto/update-order-journey.dto';
import { NotificationService } from '../notifications/notification.service';
import { Order } from '../orders/order.model';
import { Restaurant } from '../restaurants/restaurant.model';

@Injectable()
export class OrderJourneyService {
  constructor(
    @InjectModel(OrderJourney)
    private journeyModel: typeof OrderJourney,
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(Restaurant)
    private restaurantModel: typeof Restaurant,
    private notificationService: NotificationService,
  ) {}

  async create(dto: CreateOrderJourneyDto): Promise<OrderJourney> {
    console.log(
      '[OrderJourney] Creating journey with DTO:',
      JSON.stringify(dto, null, 2),
    );

    // Map longtitude (from DTO) to longitude (model property)
    const createData: any = {
      ...dto,
      longitude: dto.longtitude,
    };
    delete createData.longtitude;
    const journey = await this.journeyModel.create(createData);
    // Reload to ensure all fields are populated
    await journey.reload();

    // Get orderId from journey or use from DTO
    const journeyOrderId =
      (journey as any).orderId ||
      (journey as any).dataValues?.orderId ||
      dto.orderId;

    console.log(
      '[OrderJourney] Journey created:',
      journey.id,
      'orderId from journey:',
      (journey as any).orderId,
      'orderId from DTO:',
      dto.orderId,
      'final orderId:',
      journeyOrderId,
    );
    console.log(
      '[OrderJourney] NotificationService available:',
      !!this.notificationService,
    );

    // Create notification for customer
    await this.createJourneyNotification(journey, journeyOrderId);

    return journey;
  }

  private async createJourneyNotification(
    journey: OrderJourney,
    orderId?: number,
  ): Promise<void> {
    try {
      console.log('Creating journey notification for journey:', journey.id);
      const finalOrderId = orderId || journey.orderId;
      console.log('Journey data:', {
        id: journey.id,
        orderId: journey.orderId,
        finalOrderId,
        content: journey.content,
        timeline: journey.timeline,
      });

      if (!finalOrderId) {
        console.error('[OrderJourney] Journey orderId is undefined!');
        return;
      }

      // Get order information
      const order = await this.orderModel.findByPk(finalOrderId, {
        attributes: ['id', 'userId', 'restaurantId', 'status', 'totalPrice'],
        include: [
          { association: 'restaurant', attributes: ['id', 'userId', 'name'] },
        ],
      });

      if (!order) {
        console.error(`[OrderJourney] Order with ID ${finalOrderId} not found`);
        return;
      }

      // Get userId and restaurantId from dataValues or direct property
      const orderUserId =
        (order as any).userId || (order as any).dataValues?.userId;
      const orderRestaurantId =
        (order as any).restaurantId || (order as any).dataValues?.restaurantId;

      console.log(
        'Order found:',
        order.id,
        'userId from order:',
        (order as any).userId,
        'userId from dataValues:',
        (order as any).dataValues?.userId,
        'final userId:',
        orderUserId,
        'restaurantId:',
        orderRestaurantId,
      );

      if (!orderUserId || !orderRestaurantId) {
        console.error(
          `[OrderJourney] Order missing userId or restaurantId. userId: ${orderUserId}, restaurantId: ${orderRestaurantId}`,
        );
        return;
      }

      // Get restaurant to find owner (sentId)
      const restaurant = await this.restaurantModel.findByPk(
        orderRestaurantId,
        {
          attributes: ['id', 'userId', 'name'],
        },
      );
      if (!restaurant) {
        console.error(
          `[OrderJourney] Restaurant with ID ${orderRestaurantId} not found`,
        );
        return;
      }

      // Get restaurant userId
      const restaurantUserId =
        (restaurant as any).userId || (restaurant as any).dataValues?.userId;

      console.log(
        'Restaurant found:',
        restaurant.id,
        'userId from restaurant:',
        (restaurant as any).userId,
        'userId from dataValues:',
        (restaurant as any).dataValues?.userId,
        'final userId:',
        restaurantUserId,
      );

      if (!restaurantUserId) {
        console.error(
          `[OrderJourney] Restaurant missing userId. restaurantId: ${orderRestaurantId}`,
        );
        return;
      }

      // Build notification content
      // Get journey content and timeline from dataValues or direct property
      const journeyContent =
        (journey as any).content || (journey as any).dataValues?.content;
      const journeyTimeline =
        (journey as any).timeline || (journey as any).dataValues?.timeline;

      const content = journeyContent
        ? `Đơn hàng #${order.id} của bạn đã ${journeyContent}${journeyTimeline ? ` vào lúc ${journeyTimeline}` : ''}`
        : `Đơn hàng #${order.id} của bạn đã được cập nhật hành trình${journeyTimeline ? ` vào lúc ${journeyTimeline}` : ''}`;

      console.log('Notification content:', content);
      console.log('Notification data:', {
        content,
        type: 2,
        sentId: restaurantUserId,
        receivedId: orderUserId,
        orderId: order.id,
        isRead: false,
        isActive: true,
      });

      // Create notification
      const notification = await this.notificationService.create({
        content,
        type: 2,
        sentId: restaurantUserId,
        receivedId: orderUserId,
        orderId: order.id,
        isRead: false,
        isActive: true,
      });

      console.log('Notification created successfully:', notification.id);
    } catch (error) {
      console.error(
        '[OrderJourney] Error creating journey notification:',
        error,
      );
      console.error('[OrderJourney] Error stack:', error?.stack);
      // Don't throw error, just log it so the journey creation can succeed
    }
  }

  async findByOrder(orderId: number): Promise<OrderJourney[]> {
    return this.journeyModel.findAll({
      where: { orderId, isActive: true },
      order: [
        ['timeline', 'ASC'],
        ['createdAt', 'ASC'],
      ],
    });
  }

  async findOne(id: number): Promise<OrderJourney> {
    const item = await this.journeyModel.findByPk(id, {
      attributes: [
        'id',
        'content',
        'latitude',
        'longitude',
        'timeline',
        'isActive',
        'orderId',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!item) {
      throw new NotFoundException(`OrderJourney with ID ${id} not found`);
    }
    return item;
  }

  async update(id: number, dto: UpdateOrderJourneyDto): Promise<OrderJourney> {
    const item = await this.findOne(id);

    // Get orderId - try multiple ways to access it
    let orderId: number | undefined = undefined;

    // Try accessing orderId from the model instance
    if ((item as any).orderId !== undefined && (item as any).orderId !== null) {
      orderId = (item as any).orderId;
    } else if ((item as any).dataValues?.orderId !== undefined) {
      orderId = (item as any).dataValues.orderId;
    } else {
      // Query directly from database as fallback
      const rawData = (await this.journeyModel.findByPk(id, {
        attributes: ['orderId'],
        raw: true,
      })) as any;
      orderId = rawData?.orderId;
    }

    console.log('[OrderJourney] Before update - item:', {
      id: item.id,
      orderId: (item as any).orderId,
      dataValues: (item as any).dataValues,
      extractedOrderId: orderId,
    });

    if (!orderId) {
      console.error('[OrderJourney] Cannot find orderId for journey:', id);
      // Still proceed with update, but skip notification
      const updateData: any = { ...dto };
      if (dto.longtitude !== undefined) {
        updateData.longitude = dto.longtitude;
        delete updateData.longtitude;
      }
      await item.update(updateData);
      return await this.findOne(id);
    }

    // Map longtitude (from DTO) to longitude (model property)
    const updateData: any = { ...dto };
    if (dto.longtitude !== undefined) {
      updateData.longitude = dto.longtitude;
      delete updateData.longtitude;
    }
    await item.update(updateData);

    // Reload with explicit attributes to ensure orderId is loaded
    const updatedJourney = await this.journeyModel.findByPk(id, {
      attributes: [
        'id',
        'content',
        'latitude',
        'longitude',
        'timeline',
        'isActive',
        'orderId',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!updatedJourney) {
      throw new NotFoundException(
        `OrderJourney with ID ${id} not found after update`,
      );
    }

    // Use the orderId we extracted before update
    const finalOrderId = orderId;

    console.log(
      '[OrderJourney] Updated journey:',
      updatedJourney.id,
      'orderId from reload:',
      (updatedJourney as any).orderId,
      'using saved orderId:',
      finalOrderId,
    );

    // Create notification for customer (use saved orderId)
    await this.createJourneyNotification(updatedJourney, finalOrderId);

    return updatedJourney as OrderJourney;
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await item.destroy();
  }
}
