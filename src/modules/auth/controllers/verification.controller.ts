import { Body, Controller, HttpStatus, Patch, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiKey, GetUser, JwtAuth } from 'src/common/decorators';
import { MessageResDto } from 'src/common/dtos';
import { EmailVerifiedDto } from '../dto/email-verified.dto';
import { VerificationService } from '../services/verification.service';

@ApiKey()
@ApiTags('Verification')
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified',
    type: MessageResDto,
  })
  @Patch('email')
  emailVerified(
    @Body() emailVerifiedDto: EmailVerifiedDto,
  ): Promise<MessageResDto> {
    return this.verificationService.emailVerified(emailVerifiedDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resend verification email',
    type: MessageResDto,
  })
  @JwtAuth()
  @Post('resend-email')
  resendVerificationEmail(
    @GetUser('email') email: string,
  ): Promise<MessageResDto> {
    return this.verificationService.resendVerificationEmail(email);
  }
}
