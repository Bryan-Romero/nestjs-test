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
import { UserService } from 'src/user/user.service';

// Nuestra estrategia Jwt Passport tiene un nombre predeterminado de 'jwt'
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService<ConfigurationType>,
    private readonly userService: UserService,
  ) {
    const { secret_refresh } = configService.get<JwtType>('jwt');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret_refresh,
      passReqToCallback: true, // allows us to pass back the request to the callback function in the validate method
    });
  }

  async validate(
    request: CustomRequest,
    payload: JwtPayload,
  ): Promise<UserRequest> {
    const { sub } = payload;
    // Find user by id with exception if not found
    const user = await this.userService.findUserById({ _id: sub });

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
