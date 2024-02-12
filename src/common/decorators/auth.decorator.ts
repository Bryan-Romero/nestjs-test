import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard, RolesGuard } from '../guards';
import { Role } from '../enums';
import { Roles } from './roles.decorator';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const Auth = (...roles: Role[]) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: 'Unauthorized' }),
    ApiUnauthorizedResponse({ description: 'Forbidden' }),
    Roles(...roles),
    UseGuards(AuthGuard, RolesGuard),
  );
// Primero debe de estar el AuthGuard para que inyecte el user a la request y usarlo en RolesGuard
