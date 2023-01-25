import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export default class DeleteTranslationArgs {
  @Field(() => Int)
  id!: number;
}
