import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserCourse,
  UserCourseSchema,
} from '../../databases/schemas/userCourse.schema';
import { Course, CourseSchema } from '../../databases/schemas/course.schema';
import { User, UserSchema } from '../../databases/schemas/user.schema';
import { UserCourseController } from './user-course.controller';
import { UserCourseService } from './user-course.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserCourse.name,
        schema: UserCourseSchema,
      },
      {
        name: Course.name,
        schema: CourseSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserCourseController],
  providers: [UserCourseService],
  exports: [UserCourseService],
})
export class UserCourseModule {}
