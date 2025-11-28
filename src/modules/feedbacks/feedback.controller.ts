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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@ApiTags('feedbacks')
@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new feedback' })
  @ApiResponse({
    status: 201,
    description: 'Feedback successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateFeedbackDto })
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedbacks' })
  @ApiResponse({
    status: 200,
    description: 'List of all active feedbacks',
  })
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get feedback by order' })
  @ApiParam({ name: 'orderId', type: Number, description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Feedback of specific order (if any)',
  })
  findByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.feedbackService.findByOrder(orderId);
  }

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Get feedbacks by restaurant with summary' })
  @ApiParam({
    name: 'restaurantId',
    type: Number,
    description: 'Restaurant ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Feedback list and summary for a restaurant',
  })
  findByRestaurant(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Query('rating') rating?: string,
  ) {
    const ratingFilter = rating ? parseInt(rating, 10) : undefined;
    return this.feedbackService.findByRestaurant(restaurantId, ratingFilter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a feedback by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Feedback ID' })
  @ApiResponse({
    status: 200,
    description: 'Feedback found',
  })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a feedback' })
  @ApiParam({ name: 'id', type: Number, description: 'Feedback ID' })
  @ApiBody({ type: UpdateFeedbackDto })
  @ApiResponse({
    status: 200,
    description: 'Feedback successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a feedback (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Feedback ID' })
  @ApiResponse({
    status: 204,
    description: 'Feedback successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.remove(id);
  }
}
