import { ApiProperty } from '@nestjs/swagger';

export class SignInResDto {
  @ApiProperty({ type: String })
  access_token: string;
}
