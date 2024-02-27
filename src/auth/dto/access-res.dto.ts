import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { UserDocument } from 'src/user/entities/user.entity';

export class AccessResDto implements Pick<UserDocument, '_id' | 'email'> {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  access_token: string;

  @ApiProperty({ type: String })
  refresh_token: string;
}
