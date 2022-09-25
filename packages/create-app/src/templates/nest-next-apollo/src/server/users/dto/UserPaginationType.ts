import { Field, Int, ObjectType } from '@nestjs/graphql';

import UserType from './UserType';

@ObjectType()
export default class UserPaginationType {
  @Field(() => [UserType])
  items!: UserType[];

  @Field(() => Int)
  total!: number;
}
