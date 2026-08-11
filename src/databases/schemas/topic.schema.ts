import {
    Prop,
    Schema,
    SchemaFactory,
  } from '@nestjs/mongoose';
  
  import {
    HydratedDocument,
    Types,
  } from 'mongoose';
  
  export type TopicDocument =
    HydratedDocument<Topic>;
  
  @Schema({
    timestamps: true,
  })
  export class Topic {
    @Prop({
      required: true,
      trim: true,
    })
    title: string;
  
    @Prop({
      default: '',
    })
    description: string;
  
    @Prop({
      type: Types.ObjectId,
      ref: 'Course',
      required: true,
    })
    courseId: Types.ObjectId;
  
    @Prop({
      default: 0,
    })
    order: number;
  
    @Prop({
      default: true,
    })
    isActive: boolean;
  }
  
  export const TopicSchema =
    SchemaFactory.createForClass(Topic);