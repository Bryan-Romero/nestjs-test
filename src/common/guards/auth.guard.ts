import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConfigurationType, JwtPayload, JwtType } from '../interfaces';
import { HttpMessage } from '../enums';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';
import { CustomRequest } from '../interfaces/custom-request';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService<ConfigurationType>,
    private reflector: Reflector,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest<CustomRequest>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(HttpMessage.INVALID_TOKEN);
    }
    try {
      // 💡 We're passing the token to `verify` along with a possible secret key
      const { secret } = this.configService.get<JwtType>('jwt');
      const { sub } = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });

      const user = await this.userModel.findOne({ _id: sub });
      if (!user) {
        throw new UnauthorizedException(HttpMessage.INVALID_TOKEN);
      }

      const { _id, email, roles, username } = user;
      request.user = {
        email,
        _id,
        roles,
        username,
      };
    } catch {
      throw new UnauthorizedException(HttpMessage.INVALID_TOKEN);
    }
    return true;
  }

  private extractTokenFromHeader(request: CustomRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
