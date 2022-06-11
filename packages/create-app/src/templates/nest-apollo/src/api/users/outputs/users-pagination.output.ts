import { Field, ObjectType } from '@nestjs/graphql';

import { UserOutput } from './user.output';

@ObjectType()
export class UsersPaginationOutput {
  @Field(() => [UserOutput])
  users!: UserOutput[];

  @Field()
  total!: number;
}
