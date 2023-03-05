import { Prisma } from '@/prisma/client';

export default class CreateTranslationBody implements Omit<Prisma.TranslationCreateInput, 'createdAt' | 'updatedAt'> {
  language!: string;

  key!: string;

  value!: string;
}
