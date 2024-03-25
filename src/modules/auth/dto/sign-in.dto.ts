import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';

export class SignInDto extends PickType(User, ['email', 'password'] as const) {
  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  password: string;
}
