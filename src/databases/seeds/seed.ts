import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SeedModule } from './seed.module';

import {
  Permission,
  PermissionDocument,
} from '../schemas/permission.schema';

import {
  Role,
  RoleDocument,
} from '../schemas/role.schema';

import {
  User,
  UserDocument,
} from '../schemas/user.schema';

import { seedPermissions } from './permission.seed';
import { seedRoles } from './role.seed';
import { seedAdmin } from './admin.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    SeedModule,
  );

  try {
    // 1. Lấy PermissionModel
    const permissionModel =
      app.get<Model<PermissionDocument>>(
        getModelToken(Permission.name),
      );

    // 2. Lấy RoleModel
    const roleModel =
      app.get<Model<RoleDocument>>(
        getModelToken(Role.name),
      );

    // 3. Lấy UserModel
    const userModel =
      app.get<Model<UserDocument>>(
        getModelToken(User.name),
      );

    console.log('Starting seed...');

    // Phải chạy đúng thứ tự
    await seedPermissions(permissionModel);

    await seedRoles(
      roleModel,
      permissionModel,
    );

    await seedAdmin(
      userModel,
      roleModel,
    );

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();