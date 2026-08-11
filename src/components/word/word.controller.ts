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
  create(@Body() dto: CreateWordDto) {
    return this.wordService.create(dto);
  }

  @Get()
  @Permissions('VIEW_WORD')
  findAll() {
    return this.wordService.findAll();
  }

  @Get('topic/:topicId')
  @Permissions('VIEW_WORD')
  findByTopic(@Param('topicId') topicId: string) {
    return this.wordService.findByTopic(topicId);
  }

  @Get(':id')
  @Permissions('VIEW_WORD')
  findOne(@Param('id') id: string) {
    return this.wordService.findOne(id);
  }

  @Patch(':id')
  @Permissions('UPDATE_WORD')
  update(@Param('id') id: string, @Body() dto: UpdateWordDto) {
    return this.wordService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('DELETE_WORD')
  remove(@Param('id') id: string) {
    return this.wordService.remove(id);
  }
}
