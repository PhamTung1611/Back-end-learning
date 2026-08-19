import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import {
  User,
  UserSchema,
} from '../../databases/schemas/user.schema';
import {
  Role,
  RoleSchema,
} from '../../databases/schemas/role.schema';
import {
  AuthSession,
  AuthSessionSchema,
} from '../../databases/schemas/auth-session.schema';
import {
  AuthIdentity,
  AuthIdentitySchema,
} from '../../databases/schemas/auth-identity.schema';

@Module({
  imports: [
    ConfigModule,

    PassportModule,

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: AuthSession.name,
        schema: AuthSessionSchema,
      },
      {
        name: AuthIdentity.name,
        schema: AuthIdentitySchema,
      },
    ]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_EXPIRES_IN',
            '1h',
          ) as any,
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
  ],

  exports: [AuthService],
})
export class AuthModule {}