import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  DefaultUserType,
  ConfigurationType,
  JwtPayload,
} from 'src/common/interfaces';
import { HttpMessage } from 'src/common/enums';
import { BcryptjsService } from 'src/common/bcryptjs/bcryptjs.service';
import { SignInResDto } from './dto-res/sign-in-res.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService<ConfigurationType>,
    private readonly bcryptjsService: BcryptjsService,
  ) {}
  async signIn(signInDto: SignInDto): Promise<SignInResDto> {
    const { email, password } = signInDto;

    // Validate if email exists
    const user = await this.userModel.findOne(
      { email },
      {
        age: true,
        email: true,
        username: true,
        password: true,
      },
    );
    if (!user) throw new BadRequestException(HttpMessage.INVALID_CREDENTIALS);

    // Validate password
    const isPasswordValid = await this.bcryptjsService.compareStringHash(
      password,
      user.password,
    );
    if (!isPasswordValid)
      throw new BadRequestException(HttpMessage.INVALID_CREDENTIALS);

    return await this.signInRes(user);
  }

  async signUp(signUpDto: SignUpDto): Promise<SignInResDto> {
    const { email, username, password } = signUpDto;

    // Validate if email already exists
    const existUser = await this.userModel.findOne({ email });
    if (existUser)
      throw new BadRequestException(HttpMessage.USER_ALREADY_EXIST);

    const hash = await this.bcryptjsService.hashData(password);
    const user = await this.userModel.create({
      username,
      email,
      password: hash,
    });

    return await this.signInRes(user);
  }

  async signInRes(user: User): Promise<SignInResDto> {
    return {
      access_token: await this.getToken({ sub: user._id }),
    };
  }

  async getToken(payload: JwtPayload): Promise<string> {
    const token = await this.jwtService.signAsync(payload);

    return token;
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
      });
    }
  }
}
