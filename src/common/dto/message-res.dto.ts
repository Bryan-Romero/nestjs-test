import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageResDto {
  @Field(() => String, { nullable: true })
  message?: string;
}
