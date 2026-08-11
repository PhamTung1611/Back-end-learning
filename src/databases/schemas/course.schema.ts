import {
    Prop,
    Schema,
    SchemaFactory,
  } from '@nestjs/mongoose';
  
  import {
    HydratedDocument,
    Types,
  } from 'mongoose';
  
  export type CourseDocument =
    HydratedDocument<Course>;
  
  @Schema({
    timestamps: true,
  })
  export class Course {
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
      ref: 'Language',
      required: true,
    })
    languageId: Types.ObjectId;
  
    @Prop({
      required: true,
    })
    level: string;
  
    @Prop({
      default: '',
    })
    thumbnail: string;
  
    @Prop({
      default: 0,
    })
    order: number;
  
    @Prop({
      default: true,
    })
    isActive: boolean;
  }
  
  export const CourseSchema =
    SchemaFactory.createForClass(Course);