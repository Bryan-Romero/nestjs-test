import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Types } from 'mongoose';

export class MeResDto extends PickType(User, [
  '_id',
  'email',
  'username',
] as const) {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  username: string;
}
