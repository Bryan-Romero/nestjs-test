import { ApiProperty } from '@nestjs/swagger';

export class PaginationResDto {
  @ApiProperty()
  data: any;

  @ApiProperty({ type: Number })
  total_items: number;

  @ApiProperty({ type: Number })
  total_pages: number;
}
