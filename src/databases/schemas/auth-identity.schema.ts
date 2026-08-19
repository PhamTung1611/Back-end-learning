import {
    Prop,
    Schema,
    SchemaFactory,
  } from '@nestjs/mongoose';
  
  import {
    HydratedDocument,
    Types,
  } from 'mongoose';
  
  export type AuthIdentityDocument =
    HydratedDocument<AuthIdentity>;
  
  export enum AuthProvider {
    GOOGLE = 'GOOGLE',
    LOCAL = 'LOCAL',
    GITHUB = 'GITHUB',
    APPLE = 'APPLE',
  }
  
  @Schema({
    timestamps: true,
  })
  export class AuthIdentity {
    @Prop({
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    })
    userId: Types.ObjectId;
  
    @Prop({
      type: String,
      enum: AuthProvider,
      required: true,
    })
    provider: AuthProvider;
  
    @Prop({
      type: String,
      required: true,
      trim: true,
    })
    providerUserId: string;
  
    @Prop({
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    })
    providerEmail?: string | null;
  
    @Prop({
      type: Boolean,
      default: false,
    })
    emailVerified: boolean;
  
    @Prop({
      type: String,
      default: null,
    })
    displayName?: string | null;
  
    @Prop({
      type: String,
      default: null,
    })
    avatarUrl?: string | null;
  }
  
  export const AuthIdentitySchema =
    SchemaFactory.createForClass(
      AuthIdentity,
    );
  
  AuthIdentitySchema.index(
    {
      provider: 1,
      providerUserId: 1,
    },
    {
      unique: true,
    },
  );