import { User } from '../entities/user.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class CreateUserDto extends PickType(User, [
  'username',
  'email',
] as const) {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email: string;
}
