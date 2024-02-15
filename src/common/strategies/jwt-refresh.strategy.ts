import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConfigurationType,
  CustomRequest,
  JwtPayload,
  JwtType,
  UserRequest,
} from 'src/common/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { HttpMessage } from 'src/common/enums';

// Nuestra estrategia Jwt Passport tiene un nombre predeterminado de 'jwt'
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService<ConfigurationType>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    const { secret_refresh } = configService.get<JwtType>('jwt');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret_refresh,
      passReqToCallback: true,
    });
  }

  async validate(
    request: CustomRequest,
    payload: JwtPayload,
  ): Promise<UserRequest> {
    const { sub } = payload;

    const user = await this.userModel.findOne({ _id: sub });

    if (!user) throw new UnauthorizedException(HttpMessage.ACCESS_DENIED);

    const refresh_token = request
      .get('authorization')
      .replace('Bearer ', '')
      .trim();
    const { _id, email, roles, username } = user;
    return {
      email,
      _id,
      roles,
      username,
      refresh_token,
    };
  }
}
