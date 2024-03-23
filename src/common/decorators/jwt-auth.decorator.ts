import { UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from '../enums';
import { JwtAuthGuard, RolesGuard } from '../guards';
import { Roles } from './roles.decorator';

export const JwtAuth = (...roles: Role[]) =>
  applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard));
