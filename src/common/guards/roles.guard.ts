import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators';
import { ExceptionMessage, Role, RoleLevel } from '../enums';
import { CustomRequest } from '../interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!(requiredRoles.length > 0)) {
      return true;
    }

    const request: CustomRequest = ctx.getContext().req;

    const { roles } = request.user;

    const hasPrivilege = this.checkUserAuthorization(roles, requiredRoles);

    if (!hasPrivilege)
      throw new ForbiddenException('Access denied', ExceptionMessage.FORBIDDEN);

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
