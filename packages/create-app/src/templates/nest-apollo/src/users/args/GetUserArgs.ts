import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export default class GetUserArgs {
  @Field(() => Int)
  id!: number;
}
