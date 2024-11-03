import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

import { Prisma } from '@prisma/client';

@InputType()
export class CreateTranslationInput implements Omit<Prisma.TranslationCreateInput, 'createdAt' | 'updatedAt'> {
  @Length(2, 2)
  @Field()
  language!: string;

  @Field()
  key!: string;

  @Field()
  value!: string;
}
