import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { ExceptionMessage } from '../enums';
import { JwtRefreshAuthGuard } from '../guards';

export const JwtRefreshAuth = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: ExceptionMessage.FORBIDDEN }),
    UseGuards(JwtRefreshAuthGuard),
  );
