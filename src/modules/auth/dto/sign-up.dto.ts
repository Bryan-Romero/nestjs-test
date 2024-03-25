import { Field, InputType } from '@nestjs/graphql';
import { PickType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';

@InputType()
export class SignUpDto extends PickType(User, [
  'username',
  'email',
  'password',
] as const) {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
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
