import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConfigurationType,
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
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService<ConfigurationType>,
    @InjectModel(User.name) private userModel: Model<User>,
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

    const user = await this.userModel.findOne({ _id: sub });

    if (!user)
      throw new UnauthorizedException(
        HttpMessage.UNAUTHORIZED,
        'User not found',
      );

    const { _id, email, roles, username } = user;
    return {
      email,
      _id,
      roles,
      username,
    };
  }
}
