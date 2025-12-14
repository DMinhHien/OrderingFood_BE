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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ComplaintReportService } from './complaint-report.service';
import { CreateComplaintReportDto } from './dto/create-complaint-report.dto';
import { UpdateComplaintReportDto } from './dto/update-complaint-report.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('complaints-reports')
@Controller('complaints-reports')
export class ComplaintReportController {
  constructor(
    private readonly complaintReportService: ComplaintReportService,
  ) {}

  @Post()
  @Public() // Mọi role đều truy cập được
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new complaint report' })
  @ApiResponse({
    status: 201,
    description: 'Complaint report successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateComplaintReportDto })
  create(@Body() createComplaintReportDto: CreateComplaintReportDto) {
    return this.complaintReportService.create(createComplaintReportDto);
  }

  @Get()
  @Public() // Mọi role đều truy cập được
  @ApiOperation({ summary: 'Get all complaint reports' })
  @ApiResponse({
    status: 200,
    description: 'List of all active complaint reports',
  })
  findAll() {
    return this.complaintReportService.findAll();
  }

  @Get('user/:userId')
  @Public() // Mọi role đều truy cập được
  @ApiOperation({ summary: 'Get complaint reports by user' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'List of complaint reports for a specific user',
  })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.complaintReportService.findByUser(userId);
  }

  @Get(':id')
  @Public() // Mọi role đều truy cập được
  @ApiOperation({ summary: 'Get a complaint report by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Complaint Report ID' })
  @ApiResponse({
    status: 200,
    description: 'Complaint report found',
  })
  @ApiResponse({ status: 404, description: 'Complaint report not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.complaintReportService.findOne(id);
  }

  @Patch(':id')
  @Public() // Mọi role đều truy cập được
  @ApiOperation({ summary: 'Update a complaint report' })
  @ApiParam({ name: 'id', type: Number, description: 'Complaint Report ID' })
  @ApiBody({ type: UpdateComplaintReportDto })
  @ApiResponse({
    status: 200,
    description: 'Complaint report successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Complaint report not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComplaintReportDto: UpdateComplaintReportDto,
  ) {
    return this.complaintReportService.update(id, updateComplaintReportDto);
  }

  @Patch(':id/read')
  @Public() // Mọi role đều truy cập được
  @ApiOperation({ summary: 'Mark a complaint report as read' })
  @ApiParam({ name: 'id', type: Number, description: 'Complaint Report ID' })
  @ApiResponse({
    status: 200,
    description: 'Complaint report marked as read',
  })
  @ApiResponse({ status: 404, description: 'Complaint report not found' })
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.complaintReportService.markAsRead(id);
  }

  @Delete(':id')
  @Public() // Mọi role đều truy cập được
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a complaint report (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Complaint Report ID' })
  @ApiResponse({
    status: 204,
    description: 'Complaint report successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Complaint report not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.complaintReportService.remove(id);
  }
}
