import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  
  import {
    Role,
    RoleDocument,
  } from '../../databases/schemas/role.schema';
  
  import {
    Permission,
    PermissionDocument,
  } from '../../databases/schemas/permission.schema';
  
  import { CreateRoleDto } from './dto/create-role.dto';
  import { UpdateRoleDto } from './dto/update-role.dto';
  
  @Injectable()
  export class RoleService {
    constructor(
      @InjectModel(Role.name)
      private readonly roleModel: Model<RoleDocument>,
  
      @InjectModel(Permission.name)
      private readonly permissionModel: Model<PermissionDocument>,
    ) {}
  
    async create(dto: CreateRoleDto) {
      const existingRole = await this.roleModel.findOne({
        name: dto.name,
      });
  
      if (existingRole) {
        throw new ConflictException('Role đã tồn tại');
      }
  
      if (dto.permissions?.length) {
        await this.validatePermissions(dto.permissions);
      }
  
      return this.roleModel.create(dto);
    }
  
    async findAll() {
      return this.roleModel
        .find()
        .populate('permissions')
        .lean();
    }
  
    async findOne(id: string) {
      const role = await this.roleModel
        .findById(id)
        .populate('permissions')
        .lean();
  
      if (!role) {
        throw new NotFoundException('Role không tồn tại');
      }
  
      return role;
    }
  
    async update(id: string, dto: UpdateRoleDto) {
      if (dto.name) {
        const existingRole = await this.roleModel.findOne({
          name: dto.name,
          _id: { $ne: id },
        });
  
        if (existingRole) {
          throw new ConflictException('Role đã tồn tại');
        }
      }
  
      if (dto.permissions) {
        await this.validatePermissions(dto.permissions);
      }
  
      const role = await this.roleModel
        .findByIdAndUpdate(
          id,
          {
            $set: dto,
          },
          {
            new: true,
          },
        )
        .populate('permissions');
  
      if (!role) {
        throw new NotFoundException('Role không tồn tại');
      }
  
      return role;
    }
  
    async remove(id: string) {
      const role = await this.roleModel.findByIdAndDelete(id);
  
      if (!role) {
        throw new NotFoundException('Role không tồn tại');
      }
  
      return {
        message: 'Xóa role thành công',
      };
    }
  
    private async validatePermissions(permissionIds: string[]) {
      const count = await this.permissionModel.countDocuments({
        _id: {
          $in: permissionIds,
        },
      });
  
      const uniqueIds = [...new Set(permissionIds)];
  
      if (count !== uniqueIds.length) {
        throw new BadRequestException(
          'Có permission không tồn tại',
        );
      }
    }
  }