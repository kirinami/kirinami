import { Field, Int, ObjectType } from '@nestjs/graphql';

import { User } from '@prisma/client';

@ObjectType()
export class UserModel implements Omit<User, 'password' | 'accessToken' | 'refreshToken'> {
  @Field(() => Int)
  id!: number;

  @Field()
  email!: string;

  @Field(() => [String])
  roles!: string[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
