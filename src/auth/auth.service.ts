import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Types } from 'mongoose';
import { BcryptjsService } from 'src/common/bcryptjs/bcryptjs.service';
import { MessageResDto } from 'src/common/dto';
import { ExceptionMessage, StandardMessage } from 'src/common/enums';
import { JwtPayload, UserRequest } from 'src/common/interfaces';
import { MailService } from 'src/common/mail/mail.service';
import {
  ConfigurationType,
  DefaultUserType,
  JwtType,
} from 'src/config/configuration.interface';
import { User, UserModel } from 'src/user/entities/user.entity';
import { AccessResDto } from './dto/access-res.dto';
import { EmailVerifiedDto } from './dto/email-verified.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigurationType>,
    private readonly bcryptjsService: BcryptjsService,
    private readonly mailService: MailService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<AccessResDto> {
    const { email, password } = signInDto;

    // Validate if email exists
    const user = await this.userModel.findOne(
      { email, active: true },
      {
        age: true,
        email: true,
        username: true,
        password: true,
      },
    );
    if (!user) throw new ForbiddenException(ExceptionMessage.FORBIDDEN);

    // Validate password
    const isPasswordValid = await this.bcryptjsService.compareStringHash(
      password,
      user.password,
    );
    if (!isPasswordValid)
      throw new ForbiddenException(ExceptionMessage.FORBIDDEN);

    return await this.accessRes(user);
  }

  async login(user: UserRequest): Promise<AccessResDto> {
    return await this.accessRes(user);
  }

  async signUp(signUpDto: SignUpDto): Promise<AccessResDto> {
    const { email, username, password } = signUpDto;

    // Validate if email already exists
    const existUser = await this.userModel.findOne({ email });
    if (existUser)
      throw new ConflictException(
        ExceptionMessage.CONFLICT,
        `User ${existUser.email} already exists`,
      );

    const hash = await this.bcryptjsService.hashData(password);
    const emailVerifiedToken = randomUUID();
    const user = await this.userModel.create({
      username,
      email,
      password: hash,
      emailVerifiedToken,
    });

    // send confirmation mail
    this.mailService.sendUserConfirmation(user, emailVerifiedToken);

    return await this.accessRes(user);
  }

  async refreshTokens(_id: string, token: string): Promise<AccessResDto> {
    const user = await this.userModel.findOne({ _id }, '+hashRefreshToken');
    if (!user || !user.hashRefreshToken)
      throw new ForbiddenException(ExceptionMessage.FORBIDDEN);

    const isRefreshTokenValid = await this.bcryptjsService.compareStringHash(
      token,
      user.hashRefreshToken,
    );
    if (!isRefreshTokenValid)
      throw new ForbiddenException(ExceptionMessage.FORBIDDEN);

    return await this.accessRes(user);
  }

  async logout(_id: string): Promise<MessageResDto> {
    await this.userModel.updateOne(
      { _id, hashRefreshToken: { $ne: null } },
      {
        $set: {
          hashRefreshToken: null,
        },
      },
    );
    return {
      message: StandardMessage.SUCCESS,
    };
  }

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

  async accessRes(user: Pick<User, '_id' | 'email'>): Promise<AccessResDto> {
    const { _id, email } = user;
    const { access_token, refresh_token } = await this.getTokens({
      sub: _id.toString(),
      email,
    });

    await this.updateRefreshToken(_id, refresh_token);

    return {
      _id,
      email,
      access_token,
      refresh_token,
    };
  }

  async getTokens(
    payload: JwtPayload,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { secret_refresh, expires_in_refresh } =
      this.configService.get<JwtType>('jwt');

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: secret_refresh,
        expiresIn: expires_in_refresh,
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async updateRefreshToken(_id: Types.ObjectId, refresh_token: string) {
    const hashRefreshToken = await this.bcryptjsService.hashData(refresh_token);
    await this.userModel.updateOne({ _id }, { hashRefreshToken });
  }

  async onModuleInit() {
    await this.createDefaultUser();
  }

  private async createDefaultUser(): Promise<void> {
    const { email, password, username, role } =
      this.configService.get<DefaultUserType>('default_user');

    const existingUser = await this.userModel.findOne({
      email,
    });

    // If default user does not exist then create default user
    if (!existingUser) {
      const hash = await this.bcryptjsService.hashData(password);
      await this.userModel.create({
        username,
        email,
        password: hash,
        roles: [role],
        emailVerified: true,
      });
    }
  }
}
