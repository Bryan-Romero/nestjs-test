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
  EnvironmentVariables,
  JwtPayload,
} from 'src/common/interfaces';
import { HttpMessage } from 'src/common/enums';
import { BcryptjsService } from 'src/common/bcryptjs/bcryptjs.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly bcryptjsService: BcryptjsService,
  ) {}
  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    // Validate if email exists
    const user = await this.userModel.findOne(
      { email },
      {
        age: true,
        email: true,
        name: true,
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

  async signUp(signUpDto: SignUpDto) {
    const { email, name, password } = signUpDto;

    // Validate if email already exists
    const existUser = await this.userModel.findOne({ email });
    if (existUser)
      throw new BadRequestException(HttpMessage.USER_ALREADY_EXIST);

    const hash = await this.bcryptjsService.hashString(password);
    const user = await this.userModel.create({ name, email, password: hash });

    return await this.signInRes(user);
  }

  async signInRes(user: any) {
    return {
      access_token: await this.getToken({ id: user._id }),
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
    const { email, password, name, role } =
      this.configService.get<DefaultUserType>('default_user');

    const existingUser = await this.userModel.findOne({
      email,
    });

    // If default user does not exist then create default user
    if (!existingUser) {
      const hash = await this.bcryptjsService.hashString(password);
      await this.userModel.create({
        name,
        email,
        password: hash,
        roles: [role],
      });
    }
  }
}
