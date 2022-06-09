import { ArgsType, Field, Int } from '@nestjs/graphql';

import { UpdateUserInput } from '../inputs/update-user.input';

@ArgsType()
export class UpdateUserArgs {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => UpdateUserInput)
  input!: UpdateUserInput;
}
