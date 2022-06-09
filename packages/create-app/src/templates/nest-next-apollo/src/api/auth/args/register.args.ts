import { ArgsType, Field } from '@nestjs/graphql';

import { RegisterInput } from '../inputs/register.input';

@ArgsType()
export class RegisterArgs {
  @Field(() => RegisterInput)
  input!: RegisterInput;
}
