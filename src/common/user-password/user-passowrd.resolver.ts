import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetUser, JwtAuth } from '../decorators';
import { MessageResDto } from '../dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserPasswordService } from './user-password.service';

@Resolver()
export class UserPassowrdResolver {
  constructor(private readonly userPasswordService: UserPasswordService) {}

  @Query(() => MessageResDto)
  forgotPassword(
    @Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto,
  ): Promise<MessageResDto> {
    return this.userPasswordService.forgotPassword(forgotPasswordDto);
  }

  @Query(() => MessageResDto)
  resetPassword(
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResDto> {
    return this.userPasswordService.resetPassword(resetPasswordDto);
  }

  @JwtAuth()
  @Query(() => MessageResDto)
  updatePassword(
    @GetUser('_id') _id: string,
    @Args('updatePasswordDto') updatePasswordDto: UpdatePasswordDto,
  ): Promise<MessageResDto> {
    return this.userPasswordService.updatePassword(_id, updatePasswordDto);
  }
}
