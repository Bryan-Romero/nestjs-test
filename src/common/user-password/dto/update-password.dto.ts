import { Field, InputType } from '@nestjs/graphql';
import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';

@InputType()
export class UpdatePasswordDto extends PickType(SignUpDto, [
  'password',
] as const) {
  @Field(() => String)
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
