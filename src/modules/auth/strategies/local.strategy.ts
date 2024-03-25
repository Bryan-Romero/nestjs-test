import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ExceptionMessage } from 'src/common/enums';
import { UserRequest } from 'src/common/interfaces';
import { UserService } from 'src/modules/user/services/user.service';

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
      throw new ForbiddenException(ExceptionMessage.FORBIDDEN);
    }

    return user;
  }
}
