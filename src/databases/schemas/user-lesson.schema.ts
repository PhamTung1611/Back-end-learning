import {
    Prop,
    Schema,
    SchemaFactory,
  } from '@nestjs/mongoose';
  
  import {
    HydratedDocument,
    Types,
  } from 'mongoose';
  
  export type UserLessonDocument =
    HydratedDocument<UserLesson>;
  
  export enum UserLessonStatus {
    NOT_STARTED = 'NOT_STARTED',
    LEARNING = 'LEARNING',
    COMPLETED = 'COMPLETED',
  }
  
  @Schema({
    timestamps: true,
    versionKey: false,
  })
  export class UserLesson {
    @Prop({
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    })
    userId: Types.ObjectId;
  
    @Prop({
      type: Types.ObjectId,
      ref: 'Lesson',
      required: true,
      index: true,
    })
    lessonId: Types.ObjectId;
  
    @Prop({
      type: String,
      enum: UserLessonStatus,
      default: UserLessonStatus.NOT_STARTED,
    })
    status: UserLessonStatus;
  
    @Prop({
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    })
    progress: number;
  
    @Prop({
      type: Date,
      default: null,
    })
    startedAt?: Date | null;
  
    @Prop({
      type: Date,
      default: null,
    })
    completedAt?: Date | null;
  
    @Prop({
      type: Date,
      default: null,
    })
    lastAccessedAt?: Date | null;
  }
  
  export const UserLessonSchema =
    SchemaFactory.createForClass(
      UserLesson,
    );
  
  UserLessonSchema.index(
    {
      userId: 1,
      lessonId: 1,
    },
    {
      unique: true,
    },
  );