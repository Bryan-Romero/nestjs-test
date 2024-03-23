import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class EmailVerifiedDto {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  token: string;
}
