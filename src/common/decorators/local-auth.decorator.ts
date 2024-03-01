import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { ExceptionMessage } from '../enums';
import { LocalAuthGuard } from '../guards';

export const LocalAuth = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: ExceptionMessage.FORBIDDEN }),
    UseGuards(LocalAuthGuard),
  );
