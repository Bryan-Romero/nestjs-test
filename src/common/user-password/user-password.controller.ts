import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageResDto } from 'src/common/dto';
import { ApiKey, GetUser, JwtAuth } from '../decorators';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserPasswordService } from './user-password.service';

@ApiKey()
@ApiTags('User Password')
@Controller('user-password')
export class UserPasswordController {
  constructor(private readonly passwordService: UserPasswordService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Forgot password',
    type: MessageResDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('forgot')
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<MessageResDto> {
    return this.passwordService.forgotPassword(forgotPasswordDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reset password',
    type: MessageResDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('reset')
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResDto> {
    return this.passwordService.resetPassword(resetPasswordDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reset password',
    type: MessageResDto,
  })
  @JwtAuth()
  @Patch('update')
  updatePassword(
    @GetUser('_id') _id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<MessageResDto> {
    return this.passwordService.updatePassword(_id, updatePasswordDto);
  }
}
