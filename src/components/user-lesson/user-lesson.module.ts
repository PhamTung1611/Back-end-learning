import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import {
  UserLesson,
  UserLessonSchema,
} from '../../databases/schemas/user-lesson.schema';

import { Lesson, LessonSchema } from '../../databases/schemas/lesson.schema';

import {
  UserCourse,
  UserCourseSchema,
} from '../../databases/schemas/userCourse.schema';

import { UserLessonController } from './user-lesson.controller';

import { UserLessonService } from './user-lesson.service';

import { Topic, TopicSchema } from '../../databases/schemas/topic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserLesson.name,
        schema: UserLessonSchema,
      },
      {
        name: Lesson.name,
        schema: LessonSchema,
      },
      {
        name: Topic.name,
        schema: TopicSchema,
      },
      {
        name: UserCourse.name,
        schema: UserCourseSchema,
      },
    ]),
  ],

  controllers: [UserLessonController],

  providers: [UserLessonService],

  exports: [UserLessonService],
})
export class UserLessonModule {}
