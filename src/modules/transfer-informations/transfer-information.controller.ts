import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransferInformationService } from './transfer-information.service';
import { CreateTransferInformationDto } from './dto/create-transfer-information.dto';
import { UpdateTransferInformationDto } from './dto/update-transfer-information.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('transfer-informations')
@Controller('transfer-informations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class TransferInformationController {
  constructor(
    private readonly transferInformationService: TransferInformationService,
  ) {}

  @Post()
  @Roles(2, 3)
  @ApiOperation({ summary: 'Tạo thông tin thanh toán' })
  @ApiResponse({ status: 201, description: 'Tạo thành công' })
  create(@Body() dto: CreateTransferInformationDto) {
    return this.transferInformationService.create(dto);
  }

  @Get()
  @Roles(3)
  @ApiOperation({ summary: 'Danh sách tất cả thông tin thanh toán (admin)' })
  findAll() {
    return this.transferInformationService.findAll();
  }

  @Get('user/:userId')
  @Roles(1, 2, 3)
  @ApiOperation({ summary: 'Lấy thông tin thanh toán theo user' })
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: any,
  ) {
    const currentUserId = Number(req.user?.id);
    const currentUserRoleId = Number(req.user?.roleId);
    return this.transferInformationService.findByUser(
      userId,
      currentUserId,
      currentUserRoleId,
    );
  }

  @Get(':id')
  @Roles(1, 2, 3)
  @ApiOperation({ summary: 'Lấy chi tiết thông tin thanh toán' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const currentUserId = Number(req.user?.id);
    const isAdmin = Number(req.user?.roleId) === 3;
    return this.transferInformationService.findOne(id, currentUserId, isAdmin);
  }

  @Patch(':id')
  @Roles(2, 3)
  @ApiOperation({ summary: 'Cập nhật thông tin thanh toán' })
  @ApiBody({ type: UpdateTransferInformationDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransferInformationDto,
    @Request() req: any,
  ) {
    const currentUserId = Number(req.user?.id);
    const currentUserRoleId = Number(req.user?.roleId);
    return this.transferInformationService.update(
      id,
      dto,
      currentUserId,
      currentUserRoleId,
    );
  }

  @Delete(':id')
  @Roles(2, 3)
  @ApiOperation({ summary: 'Xóa thông tin thanh toán' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const currentUserId = Number(req.user?.id);
    const currentUserRoleId = Number(req.user?.roleId);
    return this.transferInformationService.remove(
      id,
      currentUserId,
      currentUserRoleId,
    );
  }
}
