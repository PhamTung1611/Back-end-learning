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
    // 1. Kiểm tra email tồn tại
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
      throw new BadRequestException(
        'Không tìm thấy role USER',
      );
    }
  
    // 3. Hash password
    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );
  
    // 4. Tạo user
    const newUser = await this.userModel.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
  
      // QUAN TRỌNG
      roleId: defaultRole._id,
  
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
      sub: user._id,
      email: user.email,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    // Hash token trước khi lưu DB
    const hashedAccessToken = await bcrypt.hash(accessToken, 10);

    user.accessToken = hashedAccessToken;

    await user.save();

    return {
      message: 'Đăng nhập thành công',

      accessToken,

      user: {
        username: user.username,
        email: user.email,
      },
    };
  }

  async logout(req: any) {
    const payload = req.user;

    const token = req.headers.authorization?.split(' ')[1];

    const user = await this.userModel.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    if (!user.accessToken) {
      throw new UnauthorizedException('Bạn chưa đăng nhập');
    }

    const isValidToken = await bcrypt.compare(token, user.accessToken);

    if (!isValidToken) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    user.accessToken = null;

    await user.save();

    return {
      message: 'Logout thành công',
    };
  }
}
