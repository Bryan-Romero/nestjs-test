import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PickType(PartialType(User), [
  'name',
  'age',
]) {
  @IsInt()
  @Min(0)
  age?: number;

  @IsString()
  @IsOptional()
  name?: string;
}
