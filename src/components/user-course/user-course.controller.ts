import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserCourseService } from './user-course.service';
import { EnrollCourseDto } from './dto/enroll-course.dto';

@Controller('user-courses')
@UseGuards(JwtAuthGuard)
export class UserCourseController {
  constructor(private readonly userCourseService: UserCourseService) {}

  @Post('enroll')
  async enroll(@Req() req: any, @Body() dto: EnrollCourseDto) {
    return this.userCourseService.enroll(req.user.id, dto.courseId);
  }

  @Get('me')
  async findMyCourses(@Req() req: any) {
    return this.userCourseService.findMyCourses(req.user.id);
  }

  @Get(':courseId')
  async findOne(
    @Req() req: any,

    @Param('courseId')
    courseId: string,
  ) {
    return this.userCourseService.findOne(req.user.id, courseId);
  }
}
