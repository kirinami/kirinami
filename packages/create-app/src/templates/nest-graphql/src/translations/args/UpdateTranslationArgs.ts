import { ArgsType, Field } from '@nestjs/graphql';

import UpdateTranslationInput from './inputs/UpdateTranslationInput';

@ArgsType()
export default class UpdateTranslationArgs {
  @Field(() => UpdateTranslationInput)
  input!: UpdateTranslationInput;
}
