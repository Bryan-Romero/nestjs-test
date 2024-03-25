import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PickType(PartialType(User), [
  'username',
  'age',
] as const) {
  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  age?: number;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  username?: string;
}
