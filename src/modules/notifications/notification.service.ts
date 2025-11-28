import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './notification.model';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.notificationModel.create({
      ...createNotificationDto,
      isRead: createNotificationDto.isRead ?? false,
      isActive: createNotificationDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.findAll({
      where: { isActive: true },
      include: ['sender', 'receiver', 'order'],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByReceiver(receivedId: number): Promise<Notification[]> {
    return this.notificationModel.findAll({
      where: { isActive: true, receivedId },
      include: [
        {
          association: 'sender',
        },
        {
          association: 'order',
          include: ['restaurant'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationModel.findOne({
      where: { id, isActive: true },
      include: ['sender', 'receiver', 'order'],
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.findOne(id);
    await notification.update(updateNotificationDto);
    return notification.reload();
  }

  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    if (!notification.isRead) {
      await notification.update({ isRead: true });
    }
    return notification.reload();
  }

  async remove(id: number): Promise<void> {
    const notification = await this.findOne(id);
    await notification.update({ isActive: false });
  }
}
