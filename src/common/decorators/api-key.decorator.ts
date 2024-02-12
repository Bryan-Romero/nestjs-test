import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/common/guards';

export const ApiKey = () =>
  applyDecorators(
    ApiForbiddenResponse({ description: 'Unauthorized' }),
    UseGuards(ApiKeyGuard),
  );
