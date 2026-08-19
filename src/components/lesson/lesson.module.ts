import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Lesson,
  LessonSchema,
} from '../../databases/schemas/lesson.schema';

import {
  Topic,
  TopicSchema,
} from '../../databases/schemas/topic.schema';

import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Lesson.name,
        schema: LessonSchema,
      },
      {
        name: Topic.name,
        schema: TopicSchema,
      },
    ]),
  ],

  controllers: [
    LessonController,
  ],

  providers: [
    LessonService,
  ],

  exports: [
    LessonService,
  ],
})
export class LessonModule {}