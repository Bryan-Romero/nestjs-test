import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Types } from 'mongoose';
import { Role } from 'src/common/enums';

export class FindOneResDto extends PickType(User, [
  '_id',
  'username',
  'email',
  'roles',
  'age',
  'createdAt',
  'updatedAt',
] as const) {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: Number })
  age: number;

  @ApiProperty({ type: [String] })
  roles: Role[];

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Date })
  createdAt: Date;
}
