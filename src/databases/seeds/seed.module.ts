import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Permission,
  PermissionSchema,
} from '../schemas/permission.schema';

import {
  Role,
  RoleSchema,
} from '../schemas/role.schema';

import {
  User,
  UserSchema,
} from '../schemas/user.schema';

import {
  Language,
  LanguageSchema,
} from '../schemas/language.schema';

import {
  Course,
  CourseSchema,
} from '../schemas/course.schema';

import {
  Topic,
  TopicSchema,
} from '../schemas/topic.schema';

import {
  Word,
  WordSchema,
} from '../schemas/word.schema';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URI'),
      }),
    }),

    MongooseModule.forFeature([
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Language.name,
        schema: LanguageSchema,
      },
      {
        name: Course.name,
        schema: CourseSchema,
      },
      {
        name: Topic.name,
        schema: TopicSchema,
      },{
        name: Word.name,
        schema: WordSchema,
      },
    ]),
  ],
})
export class SeedModule {}