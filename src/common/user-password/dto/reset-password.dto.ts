import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { SignUpDto } from '../../../auth/dto/sign-up.dto';

export class ResetPasswordDto extends PickType(SignUpDto, [
  'password',
] as const) {
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  token: string;
}
