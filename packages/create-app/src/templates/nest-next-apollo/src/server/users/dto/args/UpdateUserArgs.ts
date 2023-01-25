import { ArgsType, Field } from '@nestjs/graphql';

import UpdateUserInput from '../inputs/UpdateUserInput';

@ArgsType()
export default class UpdateUserArgs {
  @Field(() => UpdateUserInput)
  input!: UpdateUserInput;
}
