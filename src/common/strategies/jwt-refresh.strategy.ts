import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, UserRequest } from 'src/common/interfaces';
import { ConfigurationType, JwtType } from 'src/config/configuration.interface';
import { UserService } from 'src/user/user.service';

// Nuestra estrategia Jwt Passport tiene un nombre predeterminado de 'jwt'
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService<ConfigurationType>,
    private readonly userService: UserService,
  ) {
    const { secret_refresh } = configService.get<JwtType>('jwt');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret_refresh,
      // passReqToCallback: true,
    });
    // passReqToCallback: true, Allows us to add the request to the callback function in the validation method like:
    // validate(request: CustomRequest,payload: JwtPayload,)
  }

  async validate(payload: JwtPayload): Promise<UserRequest> {
    const { sub } = payload;
    // Find user by id with exception if not found
    const user = await this.userService.findUserById({ _id: sub });

    const { _id, email, roles, username } = user;
    return {
      email,
      _id,
      roles,
      username,
    };
  }
}
