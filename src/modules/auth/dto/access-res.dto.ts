import { ApiProperty, PickType } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';

export class AccessResDto extends PickType(User, ['_id', 'email'] as const) {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  access_token: string;

  @ApiProperty({ type: String })
  refresh_token: string;
}
