import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { OAuth2Client } from 'google-auth-library';

import { User, UserDocument } from '../../databases/schemas/user.schema';

import { Role, RoleDocument } from '../../databases/schemas/role.schema';

import {
  AuthSession,
  AuthSessionDocument,
} from '../../databases/schemas/auth-session.schema';

import {
  AuthIdentity,
  AuthIdentityDocument,
  AuthProvider,
} from '../../databases/schemas/auth-identity.schema';

import { RegisterDto } from './dto/register.dto';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  // Google Client dùng để verify Google ID Token
  private readonly googleClient: OAuth2Client;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,

    @InjectModel(AuthSession.name)
    private readonly authSessionModel: Model<AuthSessionDocument>,

    @InjectModel(AuthIdentity.name)
    private readonly authIdentityModel: Model<AuthIdentityDocument>,

    private readonly jwtService: JwtService,
  ) {
    // Tạo Google OAuth Client
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const existingUser = await this.userModel.findOne({
      email,
    });

    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const defaultRole = await this.roleModel.findOne({
      name: 'USER',
    });

    if (!defaultRole) {
      throw new BadRequestException(
        'Không tìm thấy role USER. Hãy chạy seed role trước.',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.userModel.create({
      username: dto.username.trim(),
      email,
      password: hashedPassword,
      roleId: defaultRole._id,
      accessToken: null,
      refreshToken: null,
    });

    return {
      message: 'Đăng ký thành công',

      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        roleId: newUser.roleId,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({
      email: dto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // User Google-only sẽ không có password
    if (!user.password) {
      throw new UnauthorizedException(
        'Tài khoản này không sử dụng mật khẩu. Vui lòng đăng nhập bằng Google.',
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const accessPayload = {
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    const session = await this.authSessionModel.create({
      userId: user._id,

      refreshTokenHash: 'pending',

      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

      revokedAt: null,

      lastUsedAt: null,
    });

    const refreshPayload = {
      sub: user._id.toString(),

      sessionId: session._id.toString(),
    };

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET,

      expiresIn: '7d',
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    session.refreshTokenHash = refreshTokenHash;

    await session.save();

    return {
      message: 'Đăng nhập thành công',

      accessToken,

      refreshToken,

      user: {
        username: user.username,
        email: user.email,
      },
    };
  }

  async logout(userId: string, refreshToken?: string) {
    if (!userId) {
      throw new UnauthorizedException('Không xác định được người dùng');
    }

    if (!refreshToken) {
      throw new UnauthorizedException('Không có refresh token');
    }

    let payload: {
      sub: string;
      sessionId: string;
    };

    try {
      payload = await this.jwtService.verifyAsync<{
        sub: string;
        sessionId: string;
      }>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }

    if (payload.sub !== userId) {
      throw new UnauthorizedException(
        'Refresh token không thuộc người dùng hiện tại',
      );
    }

    if (!payload.sessionId) {
      throw new UnauthorizedException('Refresh token không chứa session');
    }

    const session = await this.authSessionModel.findOne({
      _id: payload.sessionId,
      userId,
    });

    if (!session) {
      throw new UnauthorizedException('Session không tồn tại');
    }

    if (session.revokedAt) {
      throw new UnauthorizedException('Session đã được thu hồi');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Refresh token không khớp với session');
    }

    session.revokedAt = new Date();

    await session.save();

    return {
      message: 'Đăng xuất thành công',
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Không có refresh token');
    }

    let payload: any;

    // 2. Verify refresh token
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }

    // 3. Lấy sessionId từ payload
    const sessionId = payload.sessionId;

    if (!sessionId) {
      throw new UnauthorizedException('Refresh token không có session');
    }

    // 4. Tìm session trong database
    const session = await this.authSessionModel.findById(sessionId);

    if (!session) {
      throw new UnauthorizedException('Session không tồn tại');
    }

    // 5. Kiểm tra session đã bị revoke chưa
    if (session.revokedAt) {
      throw new UnauthorizedException('Session đã bị thu hồi');
    }

    // 6. Kiểm tra session hết hạn chưa
    if (session.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Session đã hết hạn');
    }

    // 7. Kiểm tra session có đúng user không
    if (session.userId.toString() !== payload.sub) {
      throw new UnauthorizedException('Session không hợp lệ');
    }

    // 8. So sánh refresh token thật với hash trong DB
    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    // 9. Tìm user
    const user = await this.userModel.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    // 10. Tạo Access Token mới
    const accessPayload = {
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const newAccessToken = await this.jwtService.signAsync(accessPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    session.lastUsedAt = new Date();

    await session.save();

    return {
      accessToken: newAccessToken,
    };
  }

  async googleLogin(credential: string) {
    // 1. VERIFY GOOGLE ID TOKEN

    const ticket = await this.googleClient.verifyIdToken({
      idToken: credential,

      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new UnauthorizedException('Google token không hợp lệ');
    }

    const googleId = payload.sub;

    const email = payload.email;

    const name = payload.name;

    const picture = payload.picture;

    const emailVerified = payload.email_verified;

    if (!email) {
      throw new BadRequestException('Google không trả email');
    }

    if (!emailVerified) {
      throw new UnauthorizedException('Email Google chưa được xác minh');
    }

    // 2. TÌM AUTH IDENTITY

    let identity = await this.authIdentityModel.findOne({
      provider: AuthProvider.GOOGLE,

      providerUserId: googleId,
    });

    let user;

    // 3. ĐÃ LOGIN GOOGLE TRƯỚC ĐÓ

    if (identity) {
      user = await this.userModel.findById(identity.userId);

      if (!user) {
        throw new UnauthorizedException('User không tồn tại');
      }
    } else {
      // 4. CHƯA CÓ GOOGLE IDENTITY

      user = await this.userModel.findOne({
        email: email.toLowerCase(),
      });

      // 5. CHƯA CÓ USER
      // → TẠO USER MỚI

      if (!user) {
        const defaultRole = await this.roleModel.findOne({
          name: 'USER',
        });

        if (!defaultRole) {
          throw new BadRequestException('Role USER chưa được cấu hình');
        }

        user = await this.userModel.create({
          email: email.toLowerCase(),

          username: name || email.split('@')[0],

          password: null,

          roleId: defaultRole._id,
        });
      }

      // 6. LINK GOOGLE → USER

      identity = await this.authIdentityModel.create({
        userId: user._id,

        provider: AuthProvider.GOOGLE,

        providerUserId: googleId,

        providerEmail: email.toLowerCase(),

        emailVerified: true,

        displayName: name || null,

        avatarUrl: picture || null,
      });
    }

    // 7. TẠO ACCESS TOKEN

    const accessPayload = {
      sub: user._id.toString(),

      email: user.email,

      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: process.env.JWT_SECRET,

      expiresIn: '1h',
    });

    // 8. TẠO AUTH SESSION

    const session = await this.authSessionModel.create({
      userId: user._id,

      refreshTokenHash: 'pending',

      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

      revokedAt: null,

      lastUsedAt: null,
    });

    // 9. TẠO REFRESH TOKEN

    const refreshPayload = {
      sub: user._id.toString(),

      sessionId: session._id.toString(),
    };

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET,

      expiresIn: '7d',
    });

    // 10. HASH REFRESH TOKEN

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    session.refreshTokenHash = refreshTokenHash;

    await session.save();

    return {
      message: 'Đăng nhập Google thành công',

      accessToken,

      refreshToken,

      user: {
        id: user._id,

        email: user.email,

        username: user.username,

        avatar: picture || null,
      },
    };
  }
}
