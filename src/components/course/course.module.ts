import { Module } from '@nestjs/common';

import {
  MongooseModule,
} from '@nestjs/mongoose';

import {
  Course,
  CourseSchema,
} from '../../databases/schemas/course.schema';

import {
  Language,
  LanguageSchema,
} from '../../databases/schemas/language.schema';

import {
  CourseController,
} from './course.controller';

import {
  CourseService,
} from './course.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Course.name,
        schema: CourseSchema,
      },
      {
        name: Language.name,
        schema: LanguageSchema,
      },
    ]),
  ],

  controllers: [
    CourseController,
  ],

  providers: [
    CourseService,
  ],

  exports: [
    CourseService,
  ],
})
export class CourseModule {}