import { Length } from 'class-validator';

import { Prisma } from '@prisma/client';

export class CreateTranslationInput implements Omit<Prisma.TranslationCreateInput, 'createdAt' | 'updatedAt'> {
  @Length(2, 2)
  language!: string;

  key!: string;

  value!: string;
}
