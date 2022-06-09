import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class RemoveUserArgs {
  @Field(() => Int)
  id!: number;
}
