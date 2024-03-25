import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class EmailVerifiedDto {
  @ApiProperty({ type: String })
  @IsUUID()
  @IsNotEmpty()
  token: string;
}
