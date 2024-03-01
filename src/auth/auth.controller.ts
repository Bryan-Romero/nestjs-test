import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiKey,
  GetToken,
  GetUser,
  JwtAuth,
  JwtRefreshAuth,
  LocalAuth,
} from 'src/common/decorators';
import { MessageResDto } from 'src/common/dto';
import { UserRequest } from 'src/common/interfaces';
import { AuthService } from './auth.service';
import { AccessResDto } from './dto/access-res.dto';
import { EmailVerifiedDto } from './dto/email-verified.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@ApiKey()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sign in with your credentials',
    type: AccessResDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: SignInDto): Promise<AccessResDto> {
    return this.authService.signIn(signInDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Log in with your credentials',
    type: AccessResDto,
  })
  @LocalAuth()
  @Post('login')
  async login(@GetUser() user: UserRequest): Promise<AccessResDto> {
    return this.authService.login(user);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sign up with your credentials',
    type: AccessResDto,
  })
  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<AccessResDto> {
    return this.authService.signUp(signUpDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh tokens',
    type: AccessResDto,
  })
  @HttpCode(HttpStatus.OK)
  @JwtRefreshAuth()
  @Post('refresh-tokens')
  refreshTokens(
    @GetUser('_id') _id: string,
    @GetToken() token: string,
  ): Promise<AccessResDto> {
    return this.authService.refreshTokens(_id, token);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Log out',
    type: MessageResDto,
  })
  @HttpCode(HttpStatus.OK)
  @JwtAuth()
  @Post('logout')
  logout(@GetUser('_id') _id: string): Promise<MessageResDto> {
    return this.authService.logout(_id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified',
    type: MessageResDto,
  })
  @Patch('email-verified')
  emailVerified(
    @Body() emailVerifiedDto: EmailVerifiedDto,
  ): Promise<MessageResDto> {
    return this.authService.emailVerified(emailVerifiedDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resend verification email',
    type: MessageResDto,
  })
  @JwtAuth()
  @Post('resend-verification-email')
  resendVerificationEmail(
    @GetUser('email') email: string,
  ): Promise<MessageResDto> {
    return this.authService.resendVerificationEmail(email);
  }
}
