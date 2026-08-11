import { Model } from 'mongoose';

import { Role, RoleDocument } from '../../databases/schemas/role.schema';

import { Permission } from '../../databases/schemas/permission.schema';

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

  const createRole = await permissionModel.findOne({
    name: 'CREATE_ROLE',
  });

  const viewRole = await permissionModel.findOne({
    name: 'VIEW_ROLE',
  });

  const updateRole = await permissionModel.findOne({
    name: 'UPDATE_ROLE',
  });

  const deleteRole = await permissionModel.findOne({
    name: 'DELETE_ROLE',
  });

  const createPermission = await permissionModel.findOne({
    name: 'CREATE_PERMISSION',
  });

  const viewPermission = await permissionModel.findOne({
    name: 'VIEW_PERMISSION',
  });

  const updatePermission = await permissionModel.findOne({
    name: 'UPDATE_PERMISSION',
  });

  const deletePermission = await permissionModel.findOne({
    name: 'DELETE_PERMISSION',
  });

  const createCourse = await permissionModel.findOne({
    name: 'CREATE_COURSE',
  });

  const viewCourse = await permissionModel.findOne({
    name: 'VIEW_COURSE',
  });

  const updateCourse = await permissionModel.findOne({
    name: 'UPDATE_COURSE',
  });

  const deleteCourse = await permissionModel.findOne({
    name: 'DELETE_COURSE',
  });

  const roles = [
    {
      name: 'ADMIN',
      description: 'Quản trị viên',

      permissions: [
        // User
        createUser?._id,
        updateUser?._id,
        deleteUser?._id,
        viewUser?._id,

        // Role
        createRole?._id,
        viewRole?._id,
        updateRole?._id,
        deleteRole?._id,

        // Permission
        createPermission?._id,
        viewPermission?._id,
        updatePermission?._id,
        deletePermission?._id,

        // Course...
        createCourse?._id,
        viewCourse?._id,
        updateCourse?._id,
        deleteCourse?._id,

        // Topic...
        // Word...
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
