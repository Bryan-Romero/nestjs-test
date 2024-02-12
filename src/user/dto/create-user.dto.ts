import { User } from '../entities/user.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class CreateUserDto extends PickType(User, ['name', 'email'] as const) {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email: string;
}
