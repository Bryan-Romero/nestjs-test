import { Field, InputType } from '@nestjs/graphql';
import { PickType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';

@InputType()
export class SignInDto extends PickType(User, ['email', 'password'] as const) {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  password: string;
}
