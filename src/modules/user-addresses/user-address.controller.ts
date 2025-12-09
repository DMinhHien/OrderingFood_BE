import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserAddressService } from './user-address.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('user-addresses')
@Controller('user-addresses')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Liên kết người dùng với địa chỉ mới' })
  @ApiResponse({ status: 201, description: 'Liên kết tạo thành công' })
  @ApiBody({ type: CreateUserAddressDto })
  create(@Body() createUserAddressDto: CreateUserAddressDto) {
    return this.userAddressService.create(createUserAddressDto);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy tất cả địa chỉ của một người dùng' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Danh sách địa chỉ của người dùng' })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userAddressService.findByUser(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy toàn bộ liên kết người dùng - địa chỉ' })
  @ApiResponse({ status: 200, description: 'Danh sách liên kết hợp lệ' })
  findAll() {
    return this.userAddressService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy chi tiết một liên kết người dùng - địa chỉ' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Liên kết tìm thấy' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userAddressService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật thông tin liên kết người dùng - địa chỉ' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserAddressDto })
  @ApiResponse({ status: 200, description: 'Liên kết cập nhật thành công' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserAddressDto: UpdateUserAddressDto,
  ) {
    return this.userAddressService.update(id, updateUserAddressDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3) // Client, Restaurant Owner, Admin
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Vô hiệu hóa một liên kết người dùng - địa chỉ' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Liên kết đã bị vô hiệu hóa' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userAddressService.remove(id);
  }
}
