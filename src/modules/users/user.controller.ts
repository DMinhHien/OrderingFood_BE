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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Email already exists',
  })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all active users',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all users including inactive ones' })
  @ApiResponse({
    status: 200,
    description: 'List of all users (active and inactive)',
    type: [UserResponseDto],
  })
  findAllIncludingInactive() {
    return this.userService.findAllIncludingInactive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user status (active/inactive)' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({ type: UpdateUserStatusDto })
  @ApiResponse({
    status: 200,
    description: 'User status successfully updated',
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return this.userService.updateStatus(id, updateUserStatusDto.isActive);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Email already exists',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }


}
