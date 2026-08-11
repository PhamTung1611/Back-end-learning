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
  
  @Schema({
    timestamps: true,
  })
  export class UserCourse {
    @Prop({
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    })
    userId: Types.ObjectId;
  
    @Prop({
      type: Types.ObjectId,
      ref: 'Course',
      required: true,
    })
    courseId: Types.ObjectId;
  
    @Prop({
      default: 0,
    })
    progress: number;
  
    @Prop({
      enum: [
        'NOT_STARTED',
        'LEARNING',
        'COMPLETED',
      ],
      default: 'NOT_STARTED',
    })
    status: string;
  
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
  }
  
  export const UserCourseSchema =
    SchemaFactory.createForClass(UserCourse);