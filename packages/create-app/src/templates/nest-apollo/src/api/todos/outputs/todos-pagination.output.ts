import { Field, ObjectType } from '@nestjs/graphql';

import { TodoOutput } from './todo.output';

@ObjectType()
export class TodosPaginationOutput {
  @Field(() => [TodoOutput])
  todos!: TodoOutput[];

  @Field()
  total!: number;
}
