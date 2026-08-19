import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Word,
  WordSchema,
} from '../../databases/schemas/word.schema';
import { WordController } from './word.controller';
import { WordService } from './word.service';
import { Lesson, LessonSchema } from 'src/databases/schemas/lesson.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Word.name,
        schema: WordSchema,
      },
      {
        name: Lesson.name,
        schema: LessonSchema,
      },
    ]),
  ],

  controllers: [WordController],

  providers: [WordService],

  exports: [WordService],
})
export class WordModule {}