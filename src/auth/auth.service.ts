import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
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
import { ErrorMessage } from 'src/common/enums';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}
  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    // Validate if email exists
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException(ErrorMessage.INVALID_CREDENTIALS);

    // Validate password
    const isPasswordValid = await this.compareStringHash(
      password,
      user.password,
    );
    if (!isPasswordValid)
      throw new BadRequestException(ErrorMessage.INVALID_CREDENTIALS);

    return {
      access_token: await this.getToken({ id: user._id }),
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, name, password } = signUpDto;

    // Validate if email already exists
    const existUser = await this.userModel.findOne({ email });
    if (existUser) throw new BadRequestException(ErrorMessage.EMAIL_EXISTS);

    const hash = await this.hashString(password);
    const user = await this.userModel.create({ name, email, password: hash });

    return {
      access_token: await this.getToken({ id: user._id }),
    };
  }

  async hashString(data: string) {
    return await bcryptjs.hashSync(data, 10);
  }

  async compareStringHash(data: string, hash: string) {
    return await bcryptjs.compareSync(data, hash);
  }

  async getToken(payload: JwtPayload): Promise<string> {
    const token = await this.jwtService.signAsync(payload);

    return token;
  }

  async onModuleInit() {
    await this.createDefaultUser();
  }

  private async createDefaultUser(): Promise<void> {
    const { email, password, name } =
      this.configService.get<DefaultUserType>('default_user');

    const existingUser = await this.userModel.findOne({
      email,
    });

    // If default user does not exist then create default user
    if (!existingUser) {
      const hash = await this.hashString(password);
      await this.userModel.create({
        name,
        email,
        password: hash,
      });
    }
  }
}
