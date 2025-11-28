import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Feedback } from './feedback.model';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Order } from '../orders/order.model';
import { Restaurant } from '../restaurants/restaurant.model';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback)
    private feedbackModel: typeof Feedback,
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(Restaurant)
    private restaurantModel: typeof Restaurant,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = await this.feedbackModel.create({
      ...createFeedbackDto,
      isActive: createFeedbackDto.isActive ?? true,
    } as any);
    await this.updateRestaurantRatingByOrder(feedback.orderId);
    return feedback;
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackModel.findAll({
      where: { isActive: true },
      include: [
        {
          association: 'order',
        },
        {
          association: 'responses',
          include: ['sender'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Feedback> {
    const feedback = await this.feedbackModel.findOne({
      where: { id, isActive: true },
      include: [
        {
          association: 'order',
        },
        {
          association: 'responses',
          include: ['sender'],
        },
      ],
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return feedback;
  }

  async update(
    id: number,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    const feedback = await this.findOne(id);
    await feedback.update(updateFeedbackDto);
    const updated = await feedback.reload();
    await this.updateRestaurantRatingByOrder(updated.orderId);
    return updated;
  }

  async remove(id: number): Promise<void> {
    const feedback = await this.findOne(id);
    await feedback.update({ isActive: false });
    await this.updateRestaurantRatingByOrder(feedback.orderId);
  }

  async findByOrder(orderId: number): Promise<Feedback | null> {
    return this.feedbackModel.findOne({
      where: { orderId, isActive: true },
      include: [
        {
          association: 'order',
          include: [
            'restaurant',
            'user',
            {
              association: 'orderDetails',
              include: ['product'],
            },
          ],
        },
        {
          association: 'responses',
          include: ['sender'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByRestaurant(
    restaurantId: number,
    rating?: number,
  ): Promise<{
    feedbacks: Feedback[];
    summary: {
      averageRating: number;
      totalReviews: number;
      distribution: Record<number, number>;
    };
  }> {
    const where: any = { isActive: true };
    if (rating) {
      where.rating = rating;
    }

    const feedbacks = await this.feedbackModel.findAll({
      where,
      include: [
        {
          association: 'order',
          required: true,
          where: { restaurantId },
          include: [
            'user',
            {
              association: 'orderDetails',
              include: ['product'],
            },
          ],
        },
        {
          association: 'responses',
          include: ['sender'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const distribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let totalRating = 0;

    feedbacks.forEach((feedback) => {
      const ratingValue = this.getFeedbackRatingValue(feedback);
      if (distribution[ratingValue] !== undefined) {
        distribution[ratingValue] += 1;
      }
      totalRating += ratingValue;
    });

    const totalReviews = feedbacks.length;
    const averageRating =
      totalReviews > 0 && Number.isFinite(totalRating / totalReviews)
        ? Math.round(totalRating / totalReviews)
        : null;

    if (averageRating !== null) {
      await this.restaurantModel.update(
        { rating: averageRating },
        { where: { id: restaurantId } },
      );
    }

    return {
      feedbacks,
      summary: {
        averageRating: averageRating ?? 0,
        totalReviews,
        distribution,
      },
    };
  }

  private async updateRestaurantRatingByOrder(orderId: number) {
    if (!orderId) return;
    const order = await this.orderModel.findOne({
      where: { id: orderId },
      attributes: ['restaurantId'],
    });
    if (!order || !order.restaurantId) return;
    const restaurantId = order.restaurantId;
    const activeFeedbacks = await this.feedbackModel.findAll({
      where: { isActive: true },
      include: [
        {
          association: 'order',
          required: true,
          where: { restaurantId },
        },
      ],
    });
    const total = activeFeedbacks.length;
    const sumRatings = activeFeedbacks.reduce(
      (sum, fb) => sum + this.getFeedbackRatingValue(fb),
      0,
    );
    if (total > 0 && Number.isFinite(sumRatings / total)) {
      const averageRounded = Math.round(sumRatings / total);
      await this.restaurantModel.update(
        { rating: averageRounded },
        { where: { id: restaurantId } },
      );
    }
  }

  private getFeedbackRatingValue(feedback: Feedback): number {
    const rawValue =
      feedback.getDataValue('rating') ?? (feedback as any).rating ?? 0;
    const numericRating = Number(rawValue);
    if (!Number.isFinite(numericRating)) {
      return 0;
    }
    const rounded = Math.round(numericRating);
    return Math.min(Math.max(rounded, 1), 5);
  }
}
