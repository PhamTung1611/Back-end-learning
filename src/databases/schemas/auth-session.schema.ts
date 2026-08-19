import {
    Prop,
    Schema,
    SchemaFactory,
  } from '@nestjs/mongoose';
  
  import {
    HydratedDocument,
    Types,
  } from 'mongoose';
  
  export type AuthSessionDocument =
    HydratedDocument<AuthSession>;
  
  @Schema({
    timestamps: true,
  })
  export class AuthSession {
    @Prop({
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    })
    userId: Types.ObjectId;
  
    @Prop({
      type: String,
      required: true,
    })
    refreshTokenHash: string;
  
    @Prop({
      type: Date,
      required: true,
    })
    expiresAt: Date;//hết hạn
  
    @Prop({
      type: Date,
      default: null,
    })
    revokedAt?: Date | null;//vô hiệu hoá
  
    @Prop({
      type: Date,
      default: null,
    })
    lastUsedAt?: Date | null;//sử dụng gần nhất
  
    @Prop({
      type: String,
      default: null,
    })
    userAgent?: string | null;// lưu thông tin vidu Mozilla/5.0 (Macintosh; Intel Mac OS X...)
  
    @Prop({
      type: String,
      default: null,
    })
    ipAddress?: string | null;
  }
  
  export const AuthSessionSchema =
    SchemaFactory.createForClass(AuthSession);