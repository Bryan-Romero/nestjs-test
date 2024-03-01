import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { ExceptionMessage, Role } from '../enums';
import { AuthGuard, RolesGuard } from '../guards';
import { Roles } from './roles.decorator';

export const Auth = (...roles: Role[]) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: ExceptionMessage.FORBIDDEN }),
    Roles(...roles),
    UseGuards(AuthGuard, RolesGuard),
  );
// Primero debe de estar el AuthGuard para que inyecte el user a la request y usarlo en RolesGuard
