import { Field, InputType } from '@nestjs/graphql';

import { type Translation } from '@/prisma/client';

@InputType()
export default class CreateTranslationInput implements Omit<Translation, 'id' | 'createdAt' | 'updatedAt'> {
  @Field()
  language!: string;

  @Field()
  key!: string;

  @Field()
  value!: string;
}
