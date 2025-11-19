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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'Role successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateRoleDto })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'List of all active roles',
  })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Role found',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({
    status: 200,
    description: 'Role successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  @ApiResponse({
    status: 204,
    description: 'Role successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }
}
