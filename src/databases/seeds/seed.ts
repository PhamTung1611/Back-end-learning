import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SeedModule } from './seed.module';

import {
  Permission,
  PermissionDocument,
} from '../schemas/permission.schema';

import {
  Role,
  RoleDocument,
} from '../schemas/role.schema';

import {
  User,
  UserDocument,
} from '../schemas/user.schema';

import {
  Language,
  LanguageDocument,
} from '../schemas/language.schema';

import {
  Course,
  CourseDocument,
} from '../schemas/course.schema';

import {
  Topic,
  TopicDocument,
} from '../schemas/topic.schema';

import {
  Lesson,
  LessonDocument,
} from '../schemas/lesson.schema';

import {
  Word,
  WordDocument,
} from '../schemas/word.schema';

// =============================
// SEED FUNCTIONS
// =============================

import { seedPermissions } from './permission.seed';
import { seedRoles } from './role.seed';
import { seedAdmin } from './admin.seed';

import { seedLanguages } from './language.seed';
import { seedCourses } from './course.seed';
import { seedTopics } from './topic.seed';
import { seedLessons } from './lesson.seed';
import { seedWords } from './word.seed';


async function bootstrap() {

  const app =
    await NestFactory.createApplicationContext(
      SeedModule,
    );

  try {
    const permissionModel =
      app.get<Model<PermissionDocument>>(
        getModelToken(
          Permission.name,
        ),
      );

    const roleModel =
      app.get<Model<RoleDocument>>(
        getModelToken(
          Role.name,
        ),
      );

    const userModel =
      app.get<Model<UserDocument>>(
        getModelToken(
          User.name,
        ),
      );

    const languageModel =
      app.get<Model<LanguageDocument>>(
        getModelToken(
          Language.name,
        ),
      );

    const courseModel =
      app.get<Model<CourseDocument>>(
        getModelToken(
          Course.name,
        ),
      );

    const topicModel =
      app.get<Model<TopicDocument>>(
        getModelToken(
          Topic.name,
        ),
      );

    const lessonModel =
      app.get<Model<LessonDocument>>(
        getModelToken(
          Lesson.name,
        ),
      );

    const wordModel =
      app.get<Model<WordDocument>>(
        getModelToken(
          Word.name,
        ),
      );

    await seedPermissions(
      permissionModel,
    );

    await seedRoles(
      roleModel,
      permissionModel,
    );

    await seedAdmin(
      userModel,
      roleModel,
    );

    await seedLanguages(
      languageModel,
    );

    await seedCourses(
      courseModel,
      languageModel,
    );

    await seedTopics(
      topicModel,
      courseModel,
    );

    await seedLessons(
      lessonModel,
      topicModel,
    );

    await seedWords(
      wordModel,
      lessonModel,
    );


    console.log(
      '✅ Seed toàn bộ dữ liệu thành công',
    );

  } catch (error) {

    console.error(
      '❌ Seed lỗi:',
      error,
    );

    process.exitCode = 1;

  } finally {

    await app.close();

  }
}


bootstrap();