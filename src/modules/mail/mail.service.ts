import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    try {
      const url = `example.com/auth/confirm?token=${token}`;

      await this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './email-verified', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          username: user.username,
          url,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendForgotPassword(user: User, token: string) {
    try {
      const url = `example.com/auth/confirm?_id=${user._id}&token=${token}`;

      await this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Instructions to Reset your Password',
        template: './forgot-password', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          username: user.username,
          url,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
