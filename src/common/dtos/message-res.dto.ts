import { ApiProperty } from '@nestjs/swagger';

export class MessageResDto {
  @ApiProperty({ type: String })
  message: string;
}
