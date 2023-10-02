import { IsString, Length } from 'class-validator';

import { Prisma } from '@prisma/client';

export class CreateTranslationDto implements Omit<Prisma.TranslationCreateInput, 'createdAt' | 'updatedAt'> {
  @Length(2, 2)
  @IsString()
  language!: string;

  @IsString()
  key!: string;

  @IsString()
  value!: string;
}
