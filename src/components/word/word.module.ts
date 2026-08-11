import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Word,
  WordSchema,
} from '../../databases/schemas/word.schema';

import {
  Topic,
  TopicSchema,
} from '../../databases/schemas/topic.schema';

import { WordController } from './word.controller';
import { WordService } from './word.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Word.name,
        schema: WordSchema,
      },
      {
        name: Topic.name,
        schema: TopicSchema,
      },
    ]),
  ],

  controllers: [WordController],

  providers: [WordService],

  exports: [WordService],
})
export class WordModule {}