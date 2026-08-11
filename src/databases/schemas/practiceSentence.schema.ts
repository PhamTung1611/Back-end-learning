import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PracticeSentenceDocument =
  HydratedDocument<PracticeSentence>;

@Schema({
  timestamps: true,
})
export class PracticeSentence {
  @Prop({
    required: true,
  })
  sentence: string;

  @Prop({
    required: true,
  })
  meaning: string;

  @Prop()
  pronunciation?: string;

  @Prop()
  audioUrl?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Topic',
    required: true,
  })
  topicId: Types.ObjectId;

  @Prop({
    type: [Types.ObjectId],
    ref: 'Word',
    default: [],
  })
  wordIds: Types.ObjectId[];

  @Prop({
    default: 0,
  })
  order: number;

  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const PracticeSentenceSchema =
  SchemaFactory.createForClass(PracticeSentence);