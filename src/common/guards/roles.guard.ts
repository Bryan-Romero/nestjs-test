import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpMessage, Role, RoleLevel } from '../enums';
import { ROLES_KEY } from '../decorators';
import { CustomRequest } from '../interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!(requiredRoles.length > 0)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<CustomRequest>();
    const user = await this.userModel.findById(request.user.id);
    if (!user) {
      return false;
    }

    const hasPrivilege = this.checkUserAuthorization(
      user.roles as Role[],
      requiredRoles,
    );

    if (!hasPrivilege) throw new ForbiddenException(HttpMessage.ACCESS_DENIED);

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
