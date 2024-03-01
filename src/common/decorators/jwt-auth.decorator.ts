import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { ExceptionMessage, Role } from '../enums';
import { JwtAuthGuard, RolesGuard } from '../guards';
import { Roles } from './roles.decorator';

export const JwtAuth = (...roles: Role[]) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: ExceptionMessage.FORBIDDEN }),
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
