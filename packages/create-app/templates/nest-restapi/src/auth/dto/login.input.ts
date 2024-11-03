import { IsEmail, MinLength } from 'class-validator';

import { User } from '@prisma/client';

export class LoginInput implements Pick<User, 'email' | 'password'> {
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;
}
