import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../guards';

export const LocalAuth = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: 'Unauthorized' }),
    UseGuards(LocalAuthGuard),
  );
