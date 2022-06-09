import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindOneUserArgs {
  @Field(() => Int, { nullable: true })
  id?: number;
}
