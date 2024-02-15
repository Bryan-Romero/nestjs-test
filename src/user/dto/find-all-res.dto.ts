import { ApiProperty } from '@nestjs/swagger';
import { PaginationResDto } from 'src/common/dto';
import { User } from '../entities/user.entity';

export class FindAllResDto extends PaginationResDto {
  @ApiProperty({ type: [User] })
  data: User[];
}
