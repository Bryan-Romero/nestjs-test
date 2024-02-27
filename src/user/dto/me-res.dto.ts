import { ApiProperty } from '@nestjs/swagger';
import { UserDocument } from '../entities/user.entity';
import { Types } from 'mongoose';

export class MeResDto
  implements Pick<UserDocument, '_id' | 'email' | 'username'>
{
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  username: string;
}
