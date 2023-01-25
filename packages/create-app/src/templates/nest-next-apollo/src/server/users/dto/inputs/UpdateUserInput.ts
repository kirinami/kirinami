import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

import CreateUserInput from './CreateUserInput';

@InputType()
export default class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id!: number;
}
