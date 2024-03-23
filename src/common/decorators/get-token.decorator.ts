import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomRequest } from '../interfaces';

export const GetToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request: CustomRequest = ctx.getContext().req;
    const token = request.get('authorization').replace('Bearer ', '').trim();

    return token || undefined;
  },
);
