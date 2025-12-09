import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TransferInformation } from './transfer-information.model';
import { CreateTransferInformationDto } from './dto/create-transfer-information.dto';
import { UpdateTransferInformationDto } from './dto/update-transfer-information.dto';
import { User } from '../users/user.model';

@Injectable()
export class TransferInformationService {
  constructor(
    @InjectModel(TransferInformation)
    private readonly transferInformationModel: typeof TransferInformation,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(dto: CreateTransferInformationDto) {
    const user = await this.userModel.findByPk(dto.userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    const payload = {
      ...dto,
      isBank: dto.isBank ?? true,
      isActive: dto.isActive ?? true,
    };
    return this.transferInformationModel.create(payload as any);
  }

  findAll() {
    return this.transferInformationModel.findAll({ include: [User] });
  }

  async findByUser(
    userId: number,
    currentUserId: number,
    currentUserRoleId: number,
  ) {
    const isAdmin = currentUserRoleId === 3;
    const isCustomer = currentUserRoleId === 1;
    // Cho phép Admin hoặc Customer xem thông tin thanh toán của seller
    // Nếu là role khác (seller), chỉ được xem của chính mình
    if (!isAdmin && !isCustomer && currentUserId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem thông tin này');
    }
    return this.transferInformationModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number, currentUserId: number, isAdmin: boolean) {
    const item = await this.transferInformationModel.findByPk(id);
    if (!item) {
      throw new NotFoundException('Không tìm thấy thông tin thanh toán');
    }
    if (!isAdmin && item.userId !== currentUserId) {
      throw new ForbiddenException('Bạn không có quyền xem thông tin này');
    }
    return item;
  }

  async update(
    id: number,
    dto: UpdateTransferInformationDto,
    currentUserId: number,
    currentUserRoleId: number,
  ) {
    const isAdmin = currentUserRoleId === 3;
    const isSeller = currentUserRoleId === 2;
    const item = await this.transferInformationModel.findByPk(id);
    if (!item) {
      throw new NotFoundException('Không tìm thấy thông tin thanh toán');
    }
    if (!isAdmin && !isSeller && item.userId !== currentUserId) {
      throw new ForbiddenException('Bạn không có quyền cập nhật thông tin này');
    }
    await item.update(dto);
    return item;
  }

  async remove(id: number, currentUserId: number, currentUserRoleId: number) {
    const isAdmin = currentUserRoleId === 3;
    const isSeller = currentUserRoleId === 2;
    const item = await this.transferInformationModel.findByPk(id);
    if (!item) {
      throw new NotFoundException('Không tìm thấy thông tin thanh toán');
    }
    if (!isAdmin && !isSeller && item.userId !== currentUserId) {
      throw new ForbiddenException('Bạn không có quyền xóa thông tin này');
    }
    await item.update({ isActive: false });
    return { success: true };
  }
}
