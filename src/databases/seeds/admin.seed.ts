import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import {
  User,
  UserDocument,
} from '../schemas/user.schema';

import {
  Role,
  RoleDocument,
} from '../schemas/role.schema';

export const seedAdmin = async (
  userModel: Model<UserDocument>,
  roleModel: Model<RoleDocument>,
) => {
  // 1. Tìm role ADMIN
  const adminRole = await roleModel.findOne({
    name: 'ADMIN',
  });

  if (!adminRole) {
    throw new Error('Không tìm thấy role ADMIN');
  }

  // 2. Kiểm tra admin đã tồn tại chưa
  const existingAdmin = await userModel.findOne({
    email: 'admin@gmail.com',
  });

  if (existingAdmin) {
    // Nếu đã có thì đảm bảo nó mang role ADMIN
    existingAdmin.roleId = adminRole._id;

    await existingAdmin.save();

    console.log('Admin đã tồn tại - cập nhật role ADMIN');
    return;
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(
    '123456',
    10,
  );

  // 4. Tạo admin
  await userModel.create({
    username: 'admin',
    email: 'admin@gmail.com',
    password: hashedPassword,
    roleId: adminRole._id,
    accessToken: null,
  });

  console.log('Admin seeded successfully');
};