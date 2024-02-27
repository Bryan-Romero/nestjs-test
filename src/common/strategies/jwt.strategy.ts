import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, UserRequest } from 'src/common/interfaces';
import { UserService } from 'src/user/user.service';
import { ConfigurationType, JwtType } from 'src/config/configuration.interface';

// Nuestra estrategia Jwt Passport tiene un nombre predeterminado de 'jwt'
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService<ConfigurationType>,
    private readonly userService: UserService,
  ) {
    const { secret } = configService.get<JwtType>('jwt');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
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
