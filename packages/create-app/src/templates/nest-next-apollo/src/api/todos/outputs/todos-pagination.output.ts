import { Field, ObjectType } from '@nestjs/graphql';

import { Todo } from '../todo.entity';

@ObjectType()
export class TodosPaginationOutput {
  @Field(() => [Todo])
  todos!: Todo[];

  @Field()
  total!: number;
}
