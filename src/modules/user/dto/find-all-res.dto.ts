import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PaginationResDto } from 'src/common/dtos';
import { User } from '../entities/user.entity';

@ObjectType()
export class FindAllResDto extends PaginationResDto {
  @Field(() => [User])
  data: User[];

  @Field(() => Int)
  total_items: number;

  @Field(() => Int)
  total_pages: number;
}
