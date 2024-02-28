import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from 'src/user/entities/user.entity';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, UserRequest } from 'src/common/interfaces';
import { HttpMessage } from 'src/common/enums';
import { BcryptjsService } from 'src/common/bcryptjs/bcryptjs.service';
import { AccessResDto } from './dto/access-res.dto';
import { MessageResDto } from 'src/common/dto';
import { MailService } from 'src/common/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { EmailVerifiedDto } from './dto/email-verified.dto';
import {
  ConfigurationType,
  DefaultUserType,
  JwtType,
} from 'src/config/configuration.interface';

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
    if (!user) throw new ForbiddenException(HttpMessage.ACCESS_DENIED);

    // Validate password
    const isPasswordValid = await this.bcryptjsService.compareStringHash(
      password,
      user.password,
    );
    if (!isPasswordValid)
      throw new ForbiddenException(HttpMessage.ACCESS_DENIED);

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
        HttpMessage.CONFLICT,
        `User ${existUser.email} already exists`,
      );

    const hash = await this.bcryptjsService.hashData(password);
    const emailVerifiedToken = uuidv4();
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

  async refreshTokens(
    _id: string,
    refresh_token: string,
  ): Promise<AccessResDto> {
    const user = await this.userModel.findOne(
      { _id },
      { email: 1, hashRefreshToken: 1 },
    );
    if (!user || !user.hashRefreshToken)
      throw new ForbiddenException(HttpMessage.ACCESS_DENIED);

    const isRefreshTokenValid = await this.bcryptjsService.compareStringHash(
      refresh_token,
      user.hashRefreshToken,
    );
    if (!isRefreshTokenValid)
      throw new ForbiddenException(HttpMessage.ACCESS_DENIED);

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
      message: HttpMessage.SUCCESS,
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
        HttpMessage.NOT_FOUND,
        `User with emailVerifiedToken ${token} does not exist`,
      );

    user.emailVerifiedToken = null;
    user.emailVerified = true;
    await user.save();

    return { message: HttpMessage.SUCCESS };
  }

  async resendVerificationEmail(email: string): Promise<MessageResDto> {
    const user = await this.userModel.findOne(
      { email, active: true },
      { username: 1, email: 1, emailVerifiedToken: 1 },
    );
    if (!user)
      throw new NotFoundException(
        HttpMessage.NOT_FOUND,
        `User with email ${email} does not exist`,
      );

    if (!user.emailVerifiedToken) {
      const emailVerifiedToken = uuidv4();
      user.emailVerifiedToken = emailVerifiedToken;
      await user.save();
    }

    await this.mailService.sendUserConfirmation(user, user.emailVerifiedToken);

    return {
      message: HttpMessage.SUCCESS,
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
