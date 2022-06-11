import { Field, Int, ObjectType } from '@nestjs/graphql';

import { UserOutput } from '@/api/users/outputs/user.output';

@ObjectType()
export class TodoOutput {
  @Field(() => Int)
  id!: number;

  @Field(() => UserOutput)
  user!: UserOutput;

  @Field()
  title!: string;

  @Field()
  completed!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
