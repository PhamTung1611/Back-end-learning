import {
    Prop,
    Schema,
    SchemaFactory,
  } from '@nestjs/mongoose';
  
  import mongoose, {
    HydratedDocument,
    Types,
  } from 'mongoose';
import { Topic } from './topic.schema';
  
  export type LessonDocument =
    HydratedDocument<Lesson>;
  
  @Schema({
    timestamps: true,
  })
  export class Lesson {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Topic.name,
        required: true,
      })
      topicId: mongoose.Types.ObjectId;
  
    @Prop({
      type: String,
      required: true,
      trim: true,
    })
    title: string;
  
    @Prop({
      type: String,
      default: '',
      trim: true,
    })
    description: string;
  
    @Prop({
      type: Number,
      default: 1,
    })
    order: number;
  
    @Prop({
      type: Boolean,
      default: true,
    })
    isActive: boolean;
  }
  
  export const LessonSchema =
    SchemaFactory.createForClass(Lesson);