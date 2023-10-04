import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Translation } from '@prisma/client';

@ObjectType()
export class TranslationModel implements Translation {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  language!: string;

  @Field(() => String)
  key!: string;

  @Field(() => String)
  value!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
