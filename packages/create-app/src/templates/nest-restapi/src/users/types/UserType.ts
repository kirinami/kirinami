import { Expose } from 'class-transformer';

import { type User } from '@/prisma/client';

export default class UserType implements Omit<User, 'password' | 'accessToken' | 'refreshToken'> {
  @Expose()
  id!: number;

  @Expose()
  email!: string;

  @Expose()
  roles!: string[];

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
