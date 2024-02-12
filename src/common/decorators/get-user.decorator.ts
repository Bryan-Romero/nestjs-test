import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomRequest, JwtPayload } from '../interfaces';

export const GetUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const { user } = request;

    return data ? user?.[data] : user;
  },
);
