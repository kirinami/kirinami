import { ArgsType, Field } from '@nestjs/graphql';

import UpsertTranslationInput from '../inputs/UpsertTranslationInput';

@ArgsType()
export default class UpsertTranslationArgs {
  @Field(() => [UpsertTranslationInput])
  input!: UpsertTranslationInput[];
}
