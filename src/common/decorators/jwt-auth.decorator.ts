import { UseGuards, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from './roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../guards';
import { Role } from '../enums';

export const JwtAuth = (...roles: Role[]) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: 'Unauthorized' }),
    ApiUnauthorizedResponse({ description: 'Forbidden' }),
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
