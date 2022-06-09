import { ArgsType, Field, Int } from '@nestjs/graphql';

import { UpdateTodoInput } from '../inputs/update-todo.input';

@ArgsType()
export class UpdateTodoArgs {
  @Field(() => Int)
  id!: number;

  @Field(() => UpdateTodoInput)
  input!: UpdateTodoInput;
}
