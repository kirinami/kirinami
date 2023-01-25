import { Field, Int, ObjectType } from '@nestjs/graphql';

import { type User } from '@/prisma/client';

@ObjectType()
export default class UserType implements Omit<User, 'password' | 'accessToken' | 'refreshToken'> {
  @Field(() => Int)
  id!: number;

  @Field()
  email!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field(() => [String])
  roles!: string[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
