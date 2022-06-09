import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindOneTodoArgs {
  @Field(() => Int)
  id!: number;
}
