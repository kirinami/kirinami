import { ArgsType, Field } from '@nestjs/graphql';

import { LoginInput } from '../inputs/login.input';

@ArgsType()
export class LoginArgs {
  @Field(() => LoginInput)
  input!: LoginInput;
}
