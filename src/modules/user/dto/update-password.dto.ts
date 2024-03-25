import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';

export class UpdatePasswordDto extends PickType(SignUpDto, [
  'password',
] as const) {
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
