import {
    Prop,
    Schema,
    SchemaFactory,
  } from '@nestjs/mongoose';
  
  import {
    HydratedDocument,
    Types,
  } from 'mongoose';
  
  export type WordDocument =
    HydratedDocument<Word>;
  
  @Schema({
    timestamps: true,
  })
  export class Word {
    @Prop({
      required: true,
      trim: true,
    })
    term: string;
  
    @Prop({
      required: true,
      trim: true,
    })
    meaning: string;
  
    @Prop({
      default: '',
    })
    pronunciation: string;
  
    @Prop({
      default: '',
    })
    pronunciationType: string;
  
    @Prop({
      default: '',
    })
    partOfSpeech: string;
  
    @Prop({
      default: '',
    })
    example: string;
  
    @Prop({
      default: '',
    })
    exampleMeaning: string;
  
    @Prop({
      default: '',
    })
    audioUrl: string;
  
    @Prop({
      default: '',
    })
    imageUrl: string;
  
    @Prop({
      type: Types.ObjectId,
      ref: 'Lesson',
      required: true,
      index: true,
    })
    lessonId: Types.ObjectId;
  
    @Prop({
      default: 0,
    })
    order: number;
  
    @Prop({
      default: true,
    })
    isActive: boolean;
  }
  
  export const WordSchema =
    SchemaFactory.createForClass(Word);