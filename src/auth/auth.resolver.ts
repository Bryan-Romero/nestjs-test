import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  ApiKey,
  GetToken,
  GetUser,
  JwtAuth,
  JwtRefreshAuth,
} from 'src/common/decorators';
import { MessageResDto } from 'src/common/dto';
import { AuthService } from './auth.service';
import { AccessResDto } from './dto/access-res.dto';
import { EmailVerifiedDto } from './dto/email-verified.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@ApiKey()
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => AccessResDto)
  async signIn(@Args('signInDto') signInDto: SignInDto): Promise<AccessResDto> {
    return this.authService.signIn(signInDto);
  }

  @Query(() => AccessResDto)
  async signUp(@Args('signUpDto') signUpDto: SignUpDto): Promise<AccessResDto> {
    return this.authService.signUp(signUpDto);
  }

  @JwtRefreshAuth()
  @Query(() => AccessResDto)
  refreshTokens(
    @GetUser('_id') _id: string,
    @GetToken() token: string,
  ): Promise<AccessResDto> {
    return this.authService.refreshTokens(_id, token);
  }

  @JwtAuth()
  @Query(() => MessageResDto)
  logout(@GetUser('_id') _id: string): Promise<MessageResDto> {
    return this.authService.logout(_id);
  }

  @Query(() => MessageResDto)
  emailVerified(
    @Args('emailVerifiedDto') emailVerifiedDto: EmailVerifiedDto,
  ): Promise<MessageResDto> {
    return this.authService.emailVerified(emailVerifiedDto);
  }

  @JwtAuth()
  @Query(() => MessageResDto)
  resendVerificationEmail(
    @GetUser('email') email: string,
  ): Promise<MessageResDto> {
    return this.authService.resendVerificationEmail(email);
  }
}
