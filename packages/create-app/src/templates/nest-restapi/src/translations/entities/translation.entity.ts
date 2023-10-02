import { Expose } from 'class-transformer';

import { Translation } from '@prisma/client';

export class TranslationEntity implements Translation {
  @Expose()
  id!: number;

  @Expose()
  language!: string;

  @Expose()
  key!: string;

  @Expose()
  value!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
