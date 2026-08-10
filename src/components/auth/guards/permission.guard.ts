import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  
  import { PERMISSIONS_KEY } from '../../../common/decorators/permissions.decorator';
  
  @Injectable()
  export class PermissionGuard implements CanActivate {
    constructor(
      private readonly reflector: Reflector,
    ) {}
  
    canActivate(
      context: ExecutionContext,
    ): boolean {
      const requiredPermissions =
        this.reflector.getAllAndOverride<string[]>(
          PERMISSIONS_KEY,
          [
            context.getHandler(),
            context.getClass(),
          ],
        );
  
      // Endpoint không yêu cầu permission
      if (!requiredPermissions?.length) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
  
      const user = request.user;
  
      if (!user) {
        throw new ForbiddenException(
          'Không tìm thấy thông tin user',
        );
      }
  
      const userPermissions =
        user.permissions || [];
  
      const hasPermission =
        requiredPermissions.every(
          (permission) =>
            userPermissions.includes(permission),
        );
  
      if (!hasPermission) {
        throw new ForbiddenException(
          'Bạn không có quyền thực hiện thao tác này',
        );
      }
  
      return true;
    }
  }