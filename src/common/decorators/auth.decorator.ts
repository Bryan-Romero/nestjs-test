import { UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from '../enums';
import { AuthGuard, RolesGuard } from '../guards';
import { Roles } from './roles.decorator';

export const Auth = (...roles: Role[]) =>
  applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
// Primero debe de estar el AuthGuard para que inyecte el user a la request y usarlo en RolesGuard
