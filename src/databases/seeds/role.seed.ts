import { Model } from 'mongoose';

import {
  Role,
} from '../../databases/schemas/role.schema';

import {
  Permission,
} from '../../databases/schemas/permission.schema';

export const seedRoles = async (
  roleModel: Model<Role>,
  permissionModel: Model<Permission>,
): Promise<void> => {
  // =========================================
  // 1. LẤY TOÀN BỘ PERMISSION TRONG DATABASE
  // =========================================

  const allPermissions =
    await permissionModel.find({});

  if (!allPermissions.length) {
    throw new Error(
      'Không có permission nào trong database',
    );
  }

  // Chỉ lấy _id
  const allPermissionIds =
    allPermissions.map(
      (permission) =>
        permission._id,
    );


  const roles = [
    {
      name: 'ADMIN',

      description:
        'Quản trị viên',

      // ADMIN có toàn bộ quyền
      permissions:
        allPermissionIds,
    },
  ];


  for (const role of roles) {
    await roleModel.findOneAndUpdate(
      {
        name:
          role.name,
      },

      {
        $set: {
          description:
            role.description,

          permissions:
            role.permissions,
        },
      },

      {
        upsert:
          true,

        returnDocument:
          'after',
      },
    );
  }

  console.log(
    `Roles seeded successfully - ADMIN có ${allPermissionIds.length} permissions`,
  );
};