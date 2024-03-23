import { Field, InputType, Int } from '@nestjs/graphql';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { User } from '../entities/user.entity';

@InputType()
export class UpdateUserDto extends PickType(PartialType(User), [
  'username',
  'age',
] as const) {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  age?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  username?: string;
}
