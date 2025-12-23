import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Response } from './response.model';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response)
    private responseModel: typeof Response,
  ) {}

  async create(createResponseDto: CreateResponseDto): Promise<Response> {
    return this.responseModel.create({
      ...createResponseDto,
      isActive: createResponseDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<Response[]> {
    // Trả về tất cả (kể cả isActive = false) để admin có thể xem và bật/tắt
    return this.responseModel.findAll({
      include: ['sender', 'feedback'],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Response> {
    // Không lọc isActive để có thể thao tác bật/tắt các response đã khóa
    const response = await this.responseModel.findOne({
      where: { id },
      include: ['sender', 'feedback'],
    });

    if (!response) {
      throw new NotFoundException(`Response with ID ${id} not found`);
    }

    return response;
  }

  async update(
    id: number,
    updateResponseDto: UpdateResponseDto,
  ): Promise<Response> {
    const response = await this.findOne(id);
    await response.update(updateResponseDto);
    return response.reload();
  }

  async remove(id: number): Promise<void> {
    const response = await this.findOne(id);
    await response.update({ isActive: false });
  }
}
