import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export default class DeleteUserArgs {
  @Field(() => Int)
  id!: number;
}
