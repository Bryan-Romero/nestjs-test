import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { User } from '../entities/user.entity';
import { ApiProperty, PickType, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PickType(PartialType(User), [
  'name',
  'age',
]) {
  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @Min(0)
  age?: number;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  name?: string;
}
