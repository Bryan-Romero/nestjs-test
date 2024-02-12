import { ApiProperty } from '@nestjs/swagger';
import { PaginationResDto } from 'src/common/pagination-dto/pagination-res.dto';
import { FindOneResDto } from './find-one-res.dto';

export class FindAllResDto extends PaginationResDto {
  @ApiProperty({ type: [FindOneResDto] })
  data: FindOneResDto[];
}
