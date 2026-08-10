import { Model } from 'mongoose';

import {
  Role,
  RoleDocument,
} from '../../databases/schemas/role.schema';

import {
  Permission,
} from '../../databases/schemas/permission.schema';

export const seedRoles = async (
  roleModel: Model<Role>,
  permissionModel: Model<Permission>,
): Promise<void> => {

  const createUser = await permissionModel.findOne({
    name: 'CREATE_USER',
  });

  const updateUser = await permissionModel.findOne({
    name: 'UPDATE_USER',
  });

  const deleteUser = await permissionModel.findOne({
    name: 'DELETE_USER',
  });

  const viewUser = await permissionModel.findOne({
    name: 'VIEW_USER',
  });

  const createLesson = await permissionModel.findOne({
    name: 'CREATE_LESSON',
  });

  const updateLesson = await permissionModel.findOne({
    name: 'UPDATE_LESSON',
  });

  const deleteLesson = await permissionModel.findOne({
    name: 'DELETE_LESSON',
  });

  const viewLesson = await permissionModel.findOne({
    name: 'VIEW_LESSON',
  });

  const roles = [
    {
      name: 'ADMIN',
      description: 'Quản trị viên',
      permissions: [
        createUser?._id,
        updateUser?._id,
        deleteUser?._id,
        viewUser?._id,
        createLesson?._id,
        updateLesson?._id,
        deleteLesson?._id,
        viewLesson?._id,
      ].filter(Boolean),
    },

    {
      name: 'USER',
      description: 'Người dùng bình thường',
      permissions: [
        viewLesson?._id,
      ].filter(Boolean),
    },

    {
      name: 'TEACHER',
      description: 'Giáo viên',
      permissions: [
        viewLesson?._id,
        createLesson?._id,
        updateLesson?._id,
      ].filter(Boolean),
    },

    {
      name: 'CTV',
      description: 'Cộng tác viên',
      permissions: [
        viewLesson?._id,
        createLesson?._id,
        updateLesson?._id,
      ].filter(Boolean),
    },
  ];

  for (const role of roles) {
    await roleModel.findOneAndUpdate(
      {
        name: role.name,
      },
      {
        $set: {
          description: role.description,
          permissions: role.permissions,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  console.log('Roles seeded successfully');
};