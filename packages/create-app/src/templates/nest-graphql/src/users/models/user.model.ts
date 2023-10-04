import { Field, Int, ObjectType } from '@nestjs/graphql';

import { User } from '@prisma/client';

@ObjectType()
export class UserModel implements Omit<User, 'password' | 'accessToken' | 'refreshToken'> {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  email!: string;

  @Field(() => [String])
  roles!: string[];

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
