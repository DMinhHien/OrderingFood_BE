import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Public() // Mọi role đều truy cập được
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateNotificationDto })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  @Public() // Mọi role đều truy cập được
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    status: 200,
    description: 'List of all active notifications',
  })
  findAll() {
    return this.notificationService.findAll();
  }

  @Get('receiver/:receivedId')
  @Public() // Mọi role đều truy cập được
  @ApiOperation({ summary: 'Get notifications by receiver' })
  @ApiParam({ name: 'receivedId', type: Number, description: 'Receiver ID' })
  @ApiResponse({
    status: 200,
    description: 'List of notifications for the receiver',
  })
  findByReceiver(@Param('receivedId', ParseIntPipe) receivedId: number) {
    return this.notificationService.findByReceiver(receivedId);
  }

  @Get(':id')
  @Public() // Mọi role đều truy cập được
  @ApiOperation({ summary: 'Get a notification by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification found',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  @Public() // Mọi role đều truy cập được
  @ApiOperation({ summary: 'Update a notification' })
  @ApiParam({ name: 'id', type: Number, description: 'Notification ID' })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiResponse({
    status: 200,
    description: 'Notification successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Patch(':id/read')
  @Public() // Mọi role đều truy cập được
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiParam({ name: 'id', type: Number, description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
  })
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.markAsRead(id);
  }

  @Delete(':id')
  @Public() // Mọi role đều truy cập được
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a notification (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Notification ID' })
  @ApiResponse({
    status: 204,
    description: 'Notification successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.remove(id);
  }
}
