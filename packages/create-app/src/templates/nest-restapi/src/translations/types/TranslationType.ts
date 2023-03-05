import { Expose } from 'class-transformer';

import { type Translation } from '@/prisma/client';

export default class TranslationType implements Translation {
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
