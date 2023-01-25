import { ArgsType, Field } from '@nestjs/graphql';

import CreateTranslationInput from '../inputs/CreateTranslationInput';

@ArgsType()
export default class CreateTranslationArgs {
  @Field(() => CreateTranslationInput)
  input!: CreateTranslationInput;
}
