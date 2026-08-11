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
    {
      name: 'CREATE_ROLE',
      description: 'Được phép tạo role',
    },
    {
      name: 'VIEW_ROLE',
      description: 'Được phép xem role',
    },
    {
      name: 'UPDATE_ROLE',
      description: 'Được phép cập nhật role',
    },
    {
      name: 'DELETE_ROLE',
      description: 'Được phép xóa role',
    },
    
    {
      name: 'CREATE_PERMISSION',
      description: 'Được phép tạo permission',
    },
    {
      name: 'VIEW_PERMISSION',
      description: 'Được phép xem permission',
    },
    {
      name: 'UPDATE_PERMISSION',
      description: 'Được phép cập nhật permission',
    },
    {
      name: 'DELETE_PERMISSION',
      description: 'Được phép xóa permission',
    },
    {
      name: 'CREATE_COURSE',
      description: 'Được phép tạo khóa học',
    },
    {
      name: 'VIEW_COURSE',
      description: 'Được phép xem khóa học',
    },
    {
      name: 'UPDATE_COURSE',
      description: 'Được phép cập nhật khóa học',
    },
    {
      name: 'DELETE_COURSE',
      description: 'Được phép xóa khóa học',
    },
    
    {
      name: 'CREATE_TOPIC',
      description: 'Được phép tạo chủ đề',
    },
    {
      name: 'VIEW_TOPIC',
      description: 'Được phép xem chủ đề',
    },
    {
      name: 'UPDATE_TOPIC',
      description: 'Được phép cập nhật chủ đề',
    },
    {
      name: 'DELETE_TOPIC',
      description: 'Được phép xóa chủ đề',
    },
    
    {
      name: 'CREATE_WORD',
      description: 'Được phép tạo từ vựng',
    },
    {
      name: 'VIEW_WORD',
      description: 'Được phép xem từ vựng',
    },
    {
      name: 'UPDATE_WORD',
      description: 'Được phép cập nhật từ vựng',
    },
    {
      name: 'DELETE_WORD',
      description: 'Được phép xóa từ vựng',
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