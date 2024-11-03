import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Translation } from '@prisma/client';

@ObjectType()
export class TranslationModel implements Translation {
  @Field(() => Int)
  id!: number;

  @Field()
  language!: string;

  @Field()
  key!: string;

  @Field()
  value!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
