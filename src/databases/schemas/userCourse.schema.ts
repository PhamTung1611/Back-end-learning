import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
  Types,
} from 'mongoose';

export type UserCourseDocument =
  HydratedDocument<UserCourse>;

export enum UserCourseStatus {
  NOT_STARTED = 'NOT_STARTED',
  LEARNING = 'LEARNING',
  COMPLETED = 'COMPLETED',
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class UserCourse {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true,
  })
  courseId: Types.ObjectId;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  })
  progress: number;

  @Prop({
    type: String,
    enum: UserCourseStatus,
    default: UserCourseStatus.NOT_STARTED,
  })
  status: UserCourseStatus;

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

export const UserCourseSchema =
  SchemaFactory.createForClass(UserCourse);

UserCourseSchema.index(
  {
    userId: 1,
    courseId: 1,
  },
  {
    unique: true,
  },
);