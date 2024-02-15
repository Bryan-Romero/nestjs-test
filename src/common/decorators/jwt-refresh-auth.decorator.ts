import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtRefreshAuthGuard } from '../guards';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const JwtRefreshAuth = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: 'Unauthorized' }),
    ApiUnauthorizedResponse({ description: 'Forbidden' }),
    UseGuards(JwtRefreshAuthGuard),
  );
