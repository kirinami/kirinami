import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class RemoveTodoArgs {
  @Field(() => Int)
  id!: number;
}
