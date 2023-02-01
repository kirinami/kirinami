import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

import CreateTranslationInput from './CreateTranslationInput';

@InputType()
export default class UpdateTranslationInput extends PartialType(CreateTranslationInput) {
  @Field(() => Int)
  id!: number;
}
