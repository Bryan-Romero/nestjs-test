import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomRequest, UserRequest } from '../interfaces';

export const GetUser = createParamDecorator(
  (data: keyof UserRequest | undefined, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request: CustomRequest = ctx.getContext().req;
    const { user } = request;

    return data ? user?.[data] : user;
  },
);
