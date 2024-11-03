import { Field, InputType, Int } from '@nestjs/graphql';

import { CreateTranslationInput } from './create-translation.input';

@InputType()
export class UpsertTranslationInput extends CreateTranslationInput {
  @Field(() => Int, { nullable: true })
  id?: number;
}
