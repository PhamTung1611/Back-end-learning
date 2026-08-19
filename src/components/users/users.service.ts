import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { User, UserDocument } from '../../databases/schemas/user.schema';

import { Role, RoleDocument } from '../../databases/schemas/role.schema';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      email: dto.email,
    });

    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const defaultRole = await this.roleModel.findOne({
      name: 'USER',
    });

    if (!defaultRole) {
      throw new NotFoundException('Không tìm thấy role USER');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      roleId: defaultRole._id,
      accessToken: null,
    });

    return {
      message: 'Tạo user thành công',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        roleId: user.roleId,
      },
    };
  }

  async getUsers() {
    const users = await this.userModel
      .find()
      .select('-password -accessToken')
      .populate({
        path: 'roleId',
        select: 'name description',
      })
      .lean();

    return {
      message: 'Lấy danh sách user thành công',
      data: users,
    };
  }

  async getUserById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('User ID không hợp lệ');
    }

    const user = await this.userModel
      .findById(id)
      .select('-password -accessToken')
      .populate({
        path: 'roleId',
        select: 'name description',
      })
      .lean();

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    return {
      message: 'Lấy user thành công',
      data: user,
    };
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('User ID không hợp lệ');
    }

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    if (dto.email && dto.email !== user.email) {
      const existingEmail = await this.userModel.findOne({
        email: dto.email,
        _id: {
          $ne: user._id,
        },
      });

      if (existingEmail) {
        throw new BadRequestException('Email đã tồn tại');
      }

      user.email = dto.email;
    }

    // đổi username
    if (dto.username) {
      user.username = dto.username;
    }

    // đổi password
    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    // đổi role
    if (dto.roleId) {
      if (!Types.ObjectId.isValid(dto.roleId)) {
        throw new BadRequestException('Role ID không hợp lệ');
      }

      const role = await this.roleModel.findById(dto.roleId);

      if (!role) {
        throw new NotFoundException('Không tìm thấy role');
      }

      user.roleId = role._id;
    }

    await user.save();

    const updatedUser = await this.userModel
      .findById(user._id)
      .select('-password -accessToken')
      .populate({
        path: 'roleId',
        select: 'name description',
      })
      .lean();

    return {
      message: 'Cập nhật user thành công',
      data: updatedUser,
    };
  }

  async deleteUser(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('User ID không hợp lệ');
    }

    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    return {
      message: 'Xóa user thành công',
    };
  }

  async getProfile(userId: string) {
    const user = this.userModel.findById(userId);
    return {
      message: 'Lấy thông tin user thành công',
      data: user,
    };
  }
}
