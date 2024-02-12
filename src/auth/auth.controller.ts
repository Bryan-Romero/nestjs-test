import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInResDto } from './dto-res/sign-in-res.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sign in with your credentials',
    type: SignInResDto,
  })
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto): Promise<SignInResDto> {
    return this.authService.signIn(signInDto);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sign up with your credentials',
    type: SignInResDto,
  })
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto): Promise<SignInResDto> {
    return this.authService.signUp(signUpDto);
  }
}
