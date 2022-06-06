import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '../user.entity';

@ObjectType()
export class UsersPaginationOutput {
  @Field(() => [User])
  users!: User[];

  @Field()
  total!: number;
}
