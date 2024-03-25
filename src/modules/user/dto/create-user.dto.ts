import { Field, InputType } from '@nestjs/graphql';
import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserDto extends PickType(User, [
  'username',
  'email',
] as const) {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  email: string;
}
