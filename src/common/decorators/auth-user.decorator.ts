import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard, RolesGuard } from '../guards';
import { Role } from '../enums';
import { Roles } from './roles.decorator';

export const AuthUser = (...roles: Role[]) =>
  applyDecorators(UseGuards(AuthGuard, RolesGuard), Roles(...roles));
// Primero debe de estar el AuthGuard para que inyecte el user a la request y usarlo en RolesGuard
