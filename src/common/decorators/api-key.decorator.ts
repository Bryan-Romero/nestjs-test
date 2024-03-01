import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiKeyGuard, X_API_KEY } from 'src/common/guards';
import { ExceptionMessage } from '../enums';

export const ApiKey = () =>
  applyDecorators(
    ApiSecurity(X_API_KEY),
    ApiUnauthorizedResponse({ description: ExceptionMessage.UNAUTHORIZED }),
    UseGuards(ApiKeyGuard),
  );
