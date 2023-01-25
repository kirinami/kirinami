import { ArgsType, Field } from '@nestjs/graphql';

import LoginInput from './inputs/LoginInput';

@ArgsType()
export default class LoginArgs {
  @Field(() => LoginInput)
  input!: LoginInput;
}
