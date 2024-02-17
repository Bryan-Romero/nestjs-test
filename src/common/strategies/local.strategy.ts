import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { HttpMessage } from 'src/common/enums';
import { UserRequest } from '../interfaces';

// Nuestra estrategia local Passport tiene un nombre predeterminado de 'local'
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<UserRequest> {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new ForbiddenException(HttpMessage.ACCESS_DENIED);
    }

    return user;
  }
}
