import { Field, Int, ObjectType } from '@nestjs/graphql';

import { type Translation } from '@/prisma/client';

@ObjectType()
export default class TranslationType implements Translation {
  @Field(() => Int)
  id!: number;

  @Field()
  locale!: string;

  @Field()
  key!: string;

  @Field()
  value!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
