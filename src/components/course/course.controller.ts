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

import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('courses')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Permissions('CREATE_COURSE')
  async create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Get()
  @Permissions('VIEW_COURSE')
  async findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  @Permissions('VIEW_COURSE')
  async findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @Permissions('UPDATE_COURSE')
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('DELETE_COURSE')
  async remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
