import { ArgsType, Field } from '@nestjs/graphql';

import { CreateTodoInput } from '../inputs/create-todo.input';

@ArgsType()
export class CreateTodoArgs {
  @Field(() => CreateTodoInput)
  input!: CreateTodoInput;
}
