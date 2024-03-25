import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ConfigurationType, JwtType } from 'src/config/configuration.interface';
import { UserService } from 'src/modules/user/services/user.service';
import { IS_PUBLIC_KEY } from '../decorators';
import { ExceptionMessage } from '../enums';
import { JwtPayload } from '../interfaces';
import { CustomRequest } from '../interfaces/custom-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigurationType>,
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request: CustomRequest = ctx.getContext().req;
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new ForbiddenException(
        'Token not found',
        ExceptionMessage.FORBIDDEN,
      );
    }
    try {
      const { secret } = this.configService.get<JwtType>('jwt');
      const { sub } = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });
      // Find user by id with exception if not found
      const user = await this.userService.findUserById(sub);
      const { _id, email, roles, username } = user;
      request.user = {
        email,
        _id,
        roles,
        username,
      };
    } catch {
      throw new ForbiddenException('Invalid token', ExceptionMessage.FORBIDDEN);
    }
    return true;
  }

  private extractTokenFromHeader(request: CustomRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') || [];
    return type === 'Bearer' ? token : undefined;
  }
}
