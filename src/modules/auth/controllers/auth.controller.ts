import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiKey,
  GetToken,
  GetUser,
  JwtAuth,
  JwtRefreshAuth,
  LocalAuth,
} from 'src/common/decorators';
import { MessageResDto } from 'src/common/dtos';
import { UserRequest } from 'src/common/interfaces';
import { AccessResDto } from '../dto/access-res.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { AuthService } from '../services/auth.service';

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
}
