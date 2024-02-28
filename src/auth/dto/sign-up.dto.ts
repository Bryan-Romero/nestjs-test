import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class SignUpDto extends PickType(User, [
  'username',
  'email',
  'password',
] as const) {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character and be at least 8 characters long',
    },
  )
  @Transform(({ value }) => value.trim())
  password: string;
}
