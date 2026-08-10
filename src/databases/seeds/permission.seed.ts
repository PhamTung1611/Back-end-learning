import { Model } from 'mongoose';

import {
  Permission,
  PermissionDocument,
} from '../../databases/schemas/permission.schema';

export const seedPermissions = async (
  permissionModel: Model<Permission>,
): Promise<PermissionDocument[]> => {
  const permissions = [
    {
      name: 'CREATE_USER',
      description: 'Được phép tạo user',
    },
    {
      name: 'UPDATE_USER',
      description: 'Được phép cập nhật user',
    },
    {
      name: 'DELETE_USER',
      description: 'Được phép xóa user',
    },
    {
      name: 'VIEW_USER',
      description: 'Được phép xem user',
    },
    {
      name: 'CREATE_LESSON',
      description: 'Được phép tạo bài học',
    },
    {
      name: 'UPDATE_LESSON',
      description: 'Được phép cập nhật bài học',
    },
    {
      name: 'DELETE_LESSON',
      description: 'Được phép xóa bài học',
    },
    {
      name: 'VIEW_LESSON',
      description: 'Được phép xem bài học',
    },
  ];

  const result: PermissionDocument[] = [];

  for (const permission of permissions) {
    const existingPermission = await permissionModel.findOne({
      name: permission.name,
    });

    if (existingPermission) {
      result.push(existingPermission);
      continue;
    }

    const newPermission = await permissionModel.create(permission);

    result.push(newPermission);
  }

  console.log('Permissions seeded successfully');

  return result;
};