import {
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  
  import {
    Permission,
    PermissionDocument,
  } from '../../databases/schemas/permission.schema';
  
  import { CreatePermissionDto } from './dto/create-permission.dto';
  import { UpdatePermissionDto } from './dto/update-permission.dto';
  
  @Injectable()
  export class PermissionService {
    constructor(
      @InjectModel(Permission.name)
      private readonly permissionModel: Model<PermissionDocument>,
    ) {}
  
    async create(dto: CreatePermissionDto) {
      const existingPermission = await this.permissionModel.findOne({
        name: dto.name,
      });
  
      if (existingPermission) {
        throw new ConflictException('Permission đã tồn tại');
      }
  
      const permission = await this.permissionModel.create(dto);
  
      return permission;
    }
  
    async findAll() {
      return this.permissionModel.find().lean();
    }
  
    async findOne(id: string) {
      const permission = await this.permissionModel.findById(id).lean();
  
      if (!permission) {
        throw new NotFoundException('Permission không tồn tại');
      }
  
      return permission;
    }
  
    async update(id: string, dto: UpdatePermissionDto) {
      if (dto.name) {
        const existingPermission = await this.permissionModel.findOne({
          name: dto.name,
          _id: { $ne: id },
        });
  
        if (existingPermission) {
          throw new ConflictException('Permission đã tồn tại');
        }
      }
  
      const permission = await this.permissionModel.findByIdAndUpdate(
        id,
        {
          $set: dto,
        },
        {
          new: true,
        },
      );
  
      if (!permission) {
        throw new NotFoundException('Permission không tồn tại');
      }
  
      return permission;
    }
  
    async remove(id: string) {
      const permission = await this.permissionModel.findByIdAndDelete(id);
  
      if (!permission) {
        throw new NotFoundException('Permission không tồn tại');
      }
  
      return {
        message: 'Xóa permission thành công',
      };
    }
  }