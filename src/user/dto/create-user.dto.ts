import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto extends PickType(User, ['name', 'email'] as const) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}
