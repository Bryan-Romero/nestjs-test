import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtRefreshAuthGuard } from '../guards';

export const JwtRefreshAuth = () =>
  applyDecorators(UseGuards(JwtRefreshAuthGuard));
