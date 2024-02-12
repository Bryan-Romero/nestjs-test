import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FindOneResDto extends PickType(User, ['email', 'name']) {
  @ApiProperty({ type: String })
  @Expose()
  email: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;
}
