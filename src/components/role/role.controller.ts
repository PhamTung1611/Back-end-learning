import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RoleService } from './role.service';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

import {
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

import {
  PermissionGuard,
} from '../auth/guards/permission.guard';

import {
  Permissions,
} from '../../common/decorators/permissions.decorator';

@Controller('roles')
@UseGuards(
  JwtAuthGuard,
  PermissionGuard,
)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  @Post()
  @Permissions('CREATE_ROLE')
  create(
    @Body() dto: CreateRoleDto,
  ) {
    return this.roleService.create(dto);
  }

  @Get()
  @Permissions('VIEW_ROLE')
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Permissions('VIEW_ROLE')
  findOne(
    @Param('id') id: string,
  ) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @Permissions('UPDATE_ROLE')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.roleService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  @Permissions('DELETE_ROLE')
  remove(
    @Param('id') id: string,
  ) {
    return this.roleService.remove(id);
  }
}