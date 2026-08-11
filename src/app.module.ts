import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './components/auth/auth.module';
import { UsersModule } from './components/users/users.module';
import { PermissionModule } from './components/permission/permission.module';
import { RoleModule } from './components/role/role.module';
import {
  CourseModule,
} from './components/course/course.module';
import { TopicModule } from './components/topic/topic.module';
import { WordModule } from './components/word/word.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.MONGO_URI!),

    AuthModule,
    UsersModule,
    PermissionModule,
    RoleModule,
    CourseModule,
    TopicModule,
    WordModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
