import { Field, InputType } from '@nestjs/graphql';

import { Translation } from '@/prisma/client';

@InputType()
export default class CreateTranslationInput implements Omit<Translation, 'id' | 'createdAt' | 'updatedAt'> {
  @Field()
  locale!: string;

  @Field()
  key!: string;

  @Field()
  value!: string;
}
