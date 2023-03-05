import { IsEmail } from 'class-validator';

import { Prisma } from '@/prisma/client';

export default class CreateUserBody
  implements Omit<Prisma.UserCreateInput, 'accessToken' | 'refreshToken' | 'createdAt' | 'updatedAt'>
{
  @IsEmail()
  email!: string;

  password!: string;

  roles!: string[];
}
