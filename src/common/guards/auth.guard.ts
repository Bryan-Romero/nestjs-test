import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigurationType, JwtType } from 'src/config/configuration.interface';
import { UserService } from 'src/user/user.service';
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
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<CustomRequest>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new ForbiddenException(
        ExceptionMessage.FORBIDDEN,
        'Token not found',
      );
    }
    try {
      const { secret } = this.configService.get<JwtType>('jwt');
      const { sub } = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });
      // Find user by id with exception if not found
      const user = await this.userService.findUserById({ _id: sub });
      const { _id, email, roles, username } = user;
      request.user = {
        email,
        _id,
        roles,
        username,
      };
    } catch {
      throw new ForbiddenException(ExceptionMessage.FORBIDDEN, 'Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: CustomRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
