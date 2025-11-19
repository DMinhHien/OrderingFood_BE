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
import { ResponseService } from './response.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';

@ApiTags('responses')
@Controller('responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new response' })
  @ApiResponse({
    status: 201,
    description: 'Response successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateResponseDto })
  create(@Body() createResponseDto: CreateResponseDto) {
    return this.responseService.create(createResponseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all responses' })
  @ApiResponse({
    status: 200,
    description: 'List of all active responses',
  })
  findAll() {
    return this.responseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a response by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Response ID' })
  @ApiResponse({
    status: 200,
    description: 'Response found',
  })
  @ApiResponse({ status: 404, description: 'Response not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.responseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a response' })
  @ApiParam({ name: 'id', type: Number, description: 'Response ID' })
  @ApiBody({ type: UpdateResponseDto })
  @ApiResponse({
    status: 200,
    description: 'Response successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Response not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResponseDto: UpdateResponseDto,
  ) {
    return this.responseService.update(id, updateResponseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a response (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Response ID' })
  @ApiResponse({
    status: 204,
    description: 'Response successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Response not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.responseService.remove(id);
  }
}
