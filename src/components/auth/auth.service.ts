import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from '../../databases/schemas/user.schema';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role, RoleDocument } from 'src/databases/schemas/role.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userModel.findOne({
      email: dto.email,
    });

    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại');
    }

    // 2. Tìm role USER
    const defaultRole = await this.roleModel.findOne({
      name: 'USER',
    });

    if (!defaultRole) {
      throw new BadRequestException('Không tìm thấy role USER');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.userModel.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,

      accessToken: null,
    });

    return {
      message: 'Đăng ký thành công',
      user: {
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

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    // Access Token
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    // Refresh Token
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    user.refreshToken = hashedRefreshToken;

    await user.save();

    return {
      message: 'Đăng nhập thành công',

      accessToken,

      refreshToken,

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async logout(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    user.refreshToken = null;

    await user.save();

    return {
      message: 'Đăng xuất thành công',
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Không có refresh token');
    }

    let payload: any;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }

    const user = await this.userModel.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isValid) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    const newPayload = {
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const newAccessToken = await this.jwtService.signAsync(newPayload, {
      secret: process.env.JWT_SECRET,

      expiresIn: '1h',
    });

    return {
      accessToken: newAccessToken,
    };
  }
}
