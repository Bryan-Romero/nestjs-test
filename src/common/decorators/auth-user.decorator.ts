import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '../guards';

export const AuthUser = () => applyDecorators(UseGuards(AuthGuard));
