import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class SignInDto extends PickType(User, ['email', 'password'] as const) {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
