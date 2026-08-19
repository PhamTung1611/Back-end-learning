import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

import {
  UserLessonService,
} from './user-lesson.service';

import {
  UpdateUserLessonProgressDto,
} from './dto/update-user-lesson-progress.dto';

@Controller('user-lessons')
@UseGuards(JwtAuthGuard)
export class UserLessonController {
  constructor(
    private readonly userLessonService:
      UserLessonService,
  ) {}

  // Bắt đầu lesson
  @Post('start/:lessonId')
  async startLesson(
    @Req() req: any,

    @Param('lessonId')
    lessonId: string,
  ) {
    return await this.userLessonService.startLesson(
      req.user.id,
      lessonId,
    );
  }


  // Lấy tất cả lesson user đang học
  @Get('me')
  async findMyLessons(
    @Req() req: any,
  ) {
    return await this.userLessonService.findMyLessons(
      req.user.id,
    );
  }


  // Lấy trạng thái 1 lesson
  @Get(':lessonId')
  async findOne(
    @Req() req: any,

    @Param('lessonId')
    lessonId: string,
  ) {
    return await this.userLessonService.findOne(
      req.user.id,
      lessonId,
    );
  }


  // Cập nhật progress
  @Patch(':lessonId/progress')
  async updateProgress(
    @Req() req: any,

    @Param('lessonId')
    lessonId: string,

    @Body()
    dto: UpdateUserLessonProgressDto,
  ) {
    return await this.userLessonService.updateProgress(
      req.user.id,
      lessonId,
      dto,
    );
  }


  // Hoàn thành lesson
  @Patch(':lessonId/complete')
  async completeLesson(
    @Req() req: any,

    @Param('lessonId')
    lessonId: string,
  ) {
    return await this.userLessonService.completeLesson(
      req.user.id,
      lessonId,
    );
  }
}