import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class SignUpDto extends PickType(User, ['name', 'email', 'password']) {
  @IsString()
  @IsNotEmpty()
  name: string;

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
