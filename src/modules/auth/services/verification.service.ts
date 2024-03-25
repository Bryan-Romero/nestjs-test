import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { MessageResDto } from 'src/common/dtos';
import { ExceptionMessage, StandardMessage } from 'src/common/enums';
import { MailService } from 'src/modules/mail/mail.service';
import { User, UserModel } from 'src/modules/user/entities/user.entity';
import { EmailVerifiedDto } from '../dto/email-verified.dto';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    private readonly mailService: MailService,
  ) {}

  async emailVerified(
    emailVerifiedDto: EmailVerifiedDto,
  ): Promise<MessageResDto> {
    const { token } = emailVerifiedDto;

    const user = await this.userModel.findOne({
      emailVerifiedToken: token,
      active: true,
    });
    if (!user)
      throw new NotFoundException(
        ExceptionMessage.NOT_FOUND,
        `User with emailVerifiedToken ${token} does not exist`,
      );

    user.emailVerifiedToken = null;
    user.emailVerified = true;
    await user.save();

    return { message: StandardMessage.SUCCESS };
  }

  async resendVerificationEmail(email: string): Promise<MessageResDto> {
    const user = await this.userModel.findOne(
      { email, active: true },
      '+emailVerifiedToken',
    );
    if (!user)
      throw new NotFoundException(
        ExceptionMessage.NOT_FOUND,
        `User with email ${email} does not exist`,
      );

    if (!user.emailVerifiedToken) {
      const emailVerifiedToken = randomUUID();
      user.emailVerifiedToken = emailVerifiedToken;
      await user.save();
    }

    await this.mailService.sendUserConfirmation(user, user.emailVerifiedToken);

    return {
      message: StandardMessage.SUCCESS,
    };
  }
}
