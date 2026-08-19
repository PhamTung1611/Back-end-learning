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
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';


@ApiTags('User Courses')
@ApiBearerAuth()
@Controller('lessons')
@UseGuards(JwtAuthGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  async create(
    @Body()
    dto: CreateLessonDto,
  ) {
    return this.lessonService.create(dto);
  }

  @Get()
  async findAll() {
    return this.lessonService.findAll();
  }

  @Get('topic/:topicId')
  async findByTopic(
    @Param('topicId')
    topicId: string,
  ) {
    return this.lessonService.findByTopic(topicId);
  }

  @Get(':id')
  async findOne(
    @Param('id')
    id: string,
  ) {
    return this.lessonService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateLessonDto,
  ) {
    return this.lessonService.update(id, dto);
  }

  @Delete(':id')
  async remove(
    @Param('id')
    id: string,
  ) {
    return this.lessonService.remove(id);
  }
}
