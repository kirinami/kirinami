import { ArgsType, Field } from '@nestjs/graphql';

import CreateUserInput from '../inputs/CreateUserInput';

@ArgsType()
export default class CreateUserArgs {
  @Field(() => CreateUserInput)
  input!: CreateUserInput;
}
