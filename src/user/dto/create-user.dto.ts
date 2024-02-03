import { OmitType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto extends OmitType(User, ['active', 'role'] as const) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  age: number;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character and be at least 8 characters long',
    },
  )
  password: string;
}
