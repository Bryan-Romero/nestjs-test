import { Field, InputType } from '@nestjs/graphql';
import { PickType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { SignUpDto } from '../../../auth/dto/sign-up.dto';

@InputType()
export class ResetPasswordDto extends PickType(SignUpDto, [
  'password',
] as const) {
  @Field(() => String)
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @Field()
  @IsMongoId()
  _id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;
}
