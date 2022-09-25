import { Field, InputType } from '@nestjs/graphql';

import { User } from '@/prisma/client';

@InputType()
export default class CreateUserInput implements Omit<User, 'id' | 'accessToken' | 'refreshToken' | 'createdAt' | 'updatedAt'> {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field(() => [String])
  roles!: string[];
}
