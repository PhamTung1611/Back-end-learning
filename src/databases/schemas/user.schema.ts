import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
  })
  username: string;

  @Prop({
    required: false,
  })
  avatar: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Role',
    required: true,
  })
  roleId: Types.ObjectId;

  @Prop({ type: String, default: null })
  accessToken: string | null;

  @Prop({
    type: String,
    default: null,
  })
  refreshToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
