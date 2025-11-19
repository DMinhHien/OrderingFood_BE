import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RevenueReport } from './revenue-report.model';
import { CreateRevenueReportDto } from './dto/create-revenue-report.dto';
import { UpdateRevenueReportDto } from './dto/update-revenue-report.dto';

@Injectable()
export class RevenueReportService {
  constructor(
    @InjectModel(RevenueReport)
    private revenueReportModel: typeof RevenueReport,
  ) {}

  async create(
    createRevenueReportDto: CreateRevenueReportDto,
  ): Promise<RevenueReport> {
    return this.revenueReportModel.create({
      ...createRevenueReportDto,
      isActive: createRevenueReportDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<RevenueReport[]> {
    return this.revenueReportModel.findAll({
      where: { isActive: true },
      include: ['restaurant'],
    });
  }

  async findOne(id: number): Promise<RevenueReport> {
    const revenueReport = await this.revenueReportModel.findOne({
      where: { id, isActive: true },
      include: ['restaurant'],
    });

    if (!revenueReport) {
      throw new NotFoundException(`RevenueReport with ID ${id} not found`);
    }

    return revenueReport;
  }

  async update(
    id: number,
    updateRevenueReportDto: UpdateRevenueReportDto,
  ): Promise<RevenueReport> {
    const revenueReport = await this.findOne(id);
    await revenueReport.update(updateRevenueReportDto);
    return revenueReport.reload();
  }

  async remove(id: number): Promise<void> {
    const revenueReport = await this.findOne(id);
    await revenueReport.update({ isActive: false });
  }
}
