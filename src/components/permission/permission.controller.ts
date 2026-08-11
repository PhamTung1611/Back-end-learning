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

import {
  PermissionService,
} from './permission.service';

import {
  CreatePermissionDto,
} from './dto/create-permission.dto';

import {
  UpdatePermissionDto,
} from './dto/update-permission.dto';

import {
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

import {
  PermissionGuard,
} from '../auth/guards/permission.guard';

import {
  Permissions,
} from '../../common/decorators/permissions.decorator';

@Controller('permissions')
@UseGuards(
  JwtAuthGuard,
  PermissionGuard,
)
export class PermissionController {
  constructor(
    private readonly permissionService:
      PermissionService,
  ) {}

  @Post()
  @Permissions('CREATE_PERMISSION')
  create(
    @Body() dto: CreatePermissionDto,
  ) {
    return this.permissionService.create(dto);
  }

  @Get()
  @Permissions('VIEW_PERMISSION')
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @Permissions('VIEW_PERMISSION')
  findOne(
    @Param('id') id: string,
  ) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  @Permissions('UPDATE_PERMISSION')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  @Permissions('DELETE_PERMISSION')
  remove(
    @Param('id') id: string,
  ) {
    return this.permissionService.remove(id);
  }
}