import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomRequest, UserRequest } from '../interfaces';

export const GetUser = createParamDecorator(
  (data: keyof UserRequest | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const { user } = request;

    return data ? user?.[data] : user;
  },
);
