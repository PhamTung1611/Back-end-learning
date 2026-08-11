import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Topic,
  TopicSchema,
} from '../../databases/schemas/topic.schema';

import {
  Course,
  CourseSchema,
} from '../../databases/schemas/course.schema';

import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Topic.name,
        schema: TopicSchema,
      },
      {
        name: Course.name,
        schema: CourseSchema,
      },
    ]),
  ],

  controllers: [TopicController],

  providers: [TopicService],

  exports: [TopicService],
})
export class TopicModule {}