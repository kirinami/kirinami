import { Field, InputType, Int } from '@nestjs/graphql';

import CreateTranslationInput from './CreateTranslationInput';

@InputType()
export default class UpdateTranslationInput extends CreateTranslationInput {
  @Field(() => Int)
  id!: number;
}
