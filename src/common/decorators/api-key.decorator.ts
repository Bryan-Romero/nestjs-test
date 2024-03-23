import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiKeyGuard } from 'src/common/guards';

export const ApiKey = () => applyDecorators(UseGuards(ApiKeyGuard));
