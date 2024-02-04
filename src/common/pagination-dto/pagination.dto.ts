import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SortOrder } from 'mongoose';

export class PaginationDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsString()
  @IsOptional()
  sort?: SortOrder;

  @IsString()
  @IsOptional()
  keyWord?: string;
}
