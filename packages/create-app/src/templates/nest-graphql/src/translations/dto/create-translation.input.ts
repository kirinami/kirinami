import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

import { Prisma } from '@prisma/client';

@InputType()
export class CreateTranslationInput implements Omit<Prisma.TranslationCreateInput, 'createdAt' | 'updatedAt'> {
  @Length(2, 2)
  @Field(() => String)
  language!: string;

  @Field(() => String)
  key!: string;

  @Field(() => String)
  value!: string;
}
