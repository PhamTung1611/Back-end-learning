import {
    Prop,
    Schema,
    SchemaFactory,
  } from '@nestjs/mongoose';
  
  import {
    HydratedDocument,
  } from 'mongoose';
  
  export type LanguageDocument =
    HydratedDocument<Language>;
  
  @Schema({
    timestamps: true,
  })
  export class Language {
    @Prop({
      required: true,
      unique: true,
      trim: true,
    })
    name: string;
  
    @Prop({
      required: true,
      unique: true,
      trim: true,
    })
    code: string;
  
    @Prop({
      default: '',
    })
    nativeName: string;
  
    @Prop({
      default: true,
    })
    isActive: boolean;
  }
  
  export const LanguageSchema =
    SchemaFactory.createForClass(Language);