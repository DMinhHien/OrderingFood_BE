import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ComplaintReport } from './complaint-report.model';
import { CreateComplaintReportDto } from './dto/create-complaint-report.dto';
import { UpdateComplaintReportDto } from './dto/update-complaint-report.dto';
import { User } from '../users/user.model';

@Injectable()
export class ComplaintReportService {
  constructor(
    @InjectModel(ComplaintReport)
    private complaintReportModel: typeof ComplaintReport,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(
    createComplaintReportDto: CreateComplaintReportDto,
  ): Promise<ComplaintReport> {
    // Kiểm tra user tồn tại
    const user = await this.userModel.findOne({
      where: { id: createComplaintReportDto.userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createComplaintReportDto.userId} not found`,
      );
    }

    const complaintReport = await this.complaintReportModel.create({
      ...createComplaintReportDto,
      isRead: createComplaintReportDto.isRead ?? false,
      isDraft: createComplaintReportDto.isDraft ?? true,
      isActive: createComplaintReportDto.isActive ?? true,
    } as any);

    return this.findOne(complaintReport.id);
  }

  async findAll(): Promise<ComplaintReport[]> {
    return this.complaintReportModel.findAll({
      where: { isActive: true },
      include: [
        {
          association: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByUser(userId: number): Promise<ComplaintReport[]> {
    return this.complaintReportModel.findAll({
      where: { userId, isActive: true },
      include: [
        {
          association: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<ComplaintReport> {
    const complaintReport = await this.complaintReportModel.findOne({
      where: { id, isActive: true },
      include: [
        {
          association: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
    });

    if (!complaintReport) {
      throw new NotFoundException(`ComplaintReport with ID ${id} not found`);
    }

    return complaintReport;
  }

  async update(
    id: number,
    updateComplaintReportDto: UpdateComplaintReportDto,
  ): Promise<ComplaintReport> {
    const complaintReport = await this.findOne(id);
    await complaintReport.update(updateComplaintReportDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const complaintReport = await this.findOne(id);
    await complaintReport.update({ isActive: false });
  }

  async markAsRead(id: number): Promise<ComplaintReport> {
    const complaintReport = await this.findOne(id);
    await complaintReport.update({ isRead: true });
    return this.findOne(id);
  }
}
