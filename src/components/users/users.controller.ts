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

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { PermissionGuard } from '../auth/guards/permission.guard';

import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // CREATE
  @Post()
  @UseGuards(
    JwtAuthGuard,
    PermissionGuard,
  )
  @Permissions('CREATE_USER')
  createUser(
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.createUser(dto);
  }

  // GET ALL
  @Get()
  @UseGuards(
    JwtAuthGuard,
    PermissionGuard,
  )
  @Permissions('VIEW_USER')
  getUsers() {
    return this.usersService.getUsers();
  }

  // GET DETAIL
  @Get(':id')
  @UseGuards(
    JwtAuthGuard,
    PermissionGuard,
  )
  @Permissions('VIEW_USER')
  getUserById(
    @Param('id') id: string,
  ) {
    return this.usersService.getUserById(id);
  }

  // UPDATE
  @Patch(':id')
  @UseGuards(
    JwtAuthGuard,
    PermissionGuard,
  )
  @Permissions('UPDATE_USER')
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(
      id,
      dto,
    );
  }

  // DELETE
  @Delete(':id')
  @UseGuards(
    JwtAuthGuard,
    PermissionGuard,
  )
  @Permissions('DELETE_USER')
  deleteUser(
    @Param('id') id: string,
  ) {
    return this.usersService.deleteUser(id);
  }
}