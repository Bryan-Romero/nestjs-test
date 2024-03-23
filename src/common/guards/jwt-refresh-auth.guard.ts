import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ExceptionMessage } from '../enums';
import { CustomRequest } from '../interfaces';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request: CustomRequest = ctx.getContext().req;
    return super.canActivate(new ExecutionContextHost([request]));
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw new ForbiddenException('Invalid token', ExceptionMessage.FORBIDDEN);
    }
    return user;
  }
}
