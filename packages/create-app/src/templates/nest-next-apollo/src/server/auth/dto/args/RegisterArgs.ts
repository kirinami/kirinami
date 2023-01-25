import { ArgsType, Field } from '@nestjs/graphql';

import RegisterInput from '../inputs/RegisterInput';

@ArgsType()
export default class RegisterArgs {
  @Field(() => RegisterInput)
  input!: RegisterInput;
}
