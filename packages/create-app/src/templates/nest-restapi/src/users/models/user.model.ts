import { Expose } from 'class-transformer';

import { User } from '@prisma/client';

export class UserModel implements Omit<User, 'password' | 'accessToken' | 'refreshToken'> {
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
