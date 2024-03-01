import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { ExceptionMessage, Role, RoleLevel } from '../enums';
import { CustomRequest } from '../interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!(requiredRoles.length > 0)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<CustomRequest>();

    const { roles } = request.user;

    const hasPrivilege = this.checkUserAuthorization(roles, requiredRoles);

    if (!hasPrivilege) throw new ForbiddenException(ExceptionMessage.FORBIDDEN);

    return true;
  }

  checkUserAuthorization = (
    userRoles: Role[],
    requiredRoles: Role[],
  ): boolean => {
    return requiredRoles.every((requiredRole) => {
      const requiredRoleLevel = this.getRoleLevel(requiredRole);

      return userRoles.some((userRole) => {
        const userRoleLevel = this.getRoleLevel(userRole);
        return userRoleLevel >= requiredRoleLevel;
      });
    });
  };

  getRoleLevel(role: string | Role): number {
    return RoleLevel[role] ?? 0;
  }
}
