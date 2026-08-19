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

import { WordService } from './word.service';

import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
@Controller('words')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Post()
  @Permissions('CREATE_WORD')
  async create(@Body() dto: CreateWordDto) {
    return this.wordService.create(dto);
  }

  @Get()
  @Permissions('VIEW_WORD')
  async findAll() {
    return this.wordService.findAll();
  }

  @Get('lesson/:lessonId')
  @Permissions('VIEW_LESSON')
  async findByLesson(
    @Param('lessonId')
    lessonId: string,
  ) {
    return this.wordService.findByLesson(lessonId);
  }

  @Get(':id')
  @Permissions('VIEW_WORD')
  async findOne(@Param('id') id: string) {
    return this.wordService.findOne(id);
  }

  @Patch(':id')
  @Permissions('UPDATE_WORD')
  async update(@Param('id') id: string, @Body() dto: UpdateWordDto) {
    return this.wordService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('DELETE_WORD')
  async remove(@Param('id') id: string) {
    return this.wordService.remove(id);
  }
}
