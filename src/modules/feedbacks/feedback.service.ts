import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Feedback } from './feedback.model';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback)
    private feedbackModel: typeof Feedback,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return this.feedbackModel.create({
      ...createFeedbackDto,
      isActive: createFeedbackDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackModel.findAll({
      where: { isActive: true },
      include: ['order'],
    });
  }

  async findOne(id: number): Promise<Feedback> {
    const feedback = await this.feedbackModel.findOne({
      where: { id, isActive: true },
      include: ['order'],
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
    return feedback.reload();
  }

  async remove(id: number): Promise<void> {
    const feedback = await this.findOne(id);
    await feedback.update({ isActive: false });
  }
}
