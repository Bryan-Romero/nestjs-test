import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetUser, JwtAuth } from 'src/common/decorators';
import { MessageResDto } from 'src/common/dtos';
import { EmailVerifiedDto } from '../dto/email-verified.dto';
import { VerificationService } from '../services/verification.service';

@Resolver()
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}

  @JwtAuth()
  @Query(() => MessageResDto)
  emailVerified(
    @Args('emailVerifiedDto') emailVerifiedDto: EmailVerifiedDto,
  ): Promise<MessageResDto> {
    return this.verificationService.emailVerified(emailVerifiedDto);
  }

  @JwtAuth()
  @Query(() => MessageResDto)
  resendVerificationEmail(
    @GetUser('email') email: string,
  ): Promise<MessageResDto> {
    return this.verificationService.resendVerificationEmail(email);
  }
}
