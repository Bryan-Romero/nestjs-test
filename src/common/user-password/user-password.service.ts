import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BcryptjsService } from 'src/common/bcryptjs/bcryptjs.service';
import { MessageResDto } from 'src/common/dto';
import { ExceptionMessage, StandardMessage } from 'src/common/enums';
import { JwtForgotPassPayload } from 'src/common/interfaces';
import { MailService } from 'src/common/mail/mail.service';
import { ConfigurationType, JwtType } from 'src/config/configuration.interface';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserPasswordService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigurationType>,
    private readonly bcryptjsService: BcryptjsService,
    private readonly mailService: MailService,
  ) {}

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<MessageResDto> {
    const { email } = forgotPasswordDto;
    // Find user by email with exception if not found
    const user = await this.userService.findUserByEmail({
      email,
      projection: { username: 1, email: 1, password: 1 },
    });

    const forgotPasswordToken = await this.getForgotPasswordToken(user);
    await this.mailService.sendForgotPassword(user, forgotPasswordToken);

    return {
      message: StandardMessage.SUCCESS,
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResDto> {
    try {
      const { _id, password, confirmPassword, token } = resetPasswordDto;
      // Find user by id with exception if not found
      const user = await this.userService.findUserById({
        _id,
        projection: { email: 1, password: 1 },
      });

      const secret =
        this.configService.get<JwtType>('jwt').secret + user.password;
      const { email, sub } =
        await this.jwtService.verifyAsync<JwtForgotPassPayload>(token, {
          secret,
        });

      if (user.email !== email || user._id.toString() !== sub)
        throw new BadRequestException(
          ExceptionMessage.BAD_REQUEST,
          'Email do not match',
        );

      if (password !== confirmPassword)
        throw new BadRequestException(
          ExceptionMessage.BAD_REQUEST,
          'Passwords do not match',
        );

      const hash = await this.bcryptjsService.hashData(password);
      user.password = hash;
      await user.save();

      return {
        message: StandardMessage.SUCCESS,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new ForbiddenException(ExceptionMessage.FORBIDDEN, 'Invalid token');
    }
  }

  async updatePassword(
    _id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<MessageResDto> {
    // Find user by id with exception if not found
    const user = await this.userService.findUserById({ _id });

    const { password, confirmPassword } = updatePasswordDto;
    if (password !== confirmPassword)
      throw new BadRequestException(
        ExceptionMessage.BAD_REQUEST,
        'Passwords do not match',
      );

    const hash = await this.bcryptjsService.hashData(password);
    user.password = hash;
    await user.save();

    return {
      message: StandardMessage.SUCCESS,
    };
  }

  async getForgotPasswordToken(user: User): Promise<string> {
    const { email, _id, password } = user;
    const payload: JwtForgotPassPayload = {
      sub: _id.toString(),
      email,
    };
    const secret = this.configService.get<JwtType>('jwt').secret + password;
    const forgotPasswordToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: this.configService.get<JwtType>('jwt').expires_in,
    });

    return forgotPasswordToken;
  }
}
