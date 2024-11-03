import { IsEmail, IsString, MinLength } from 'class-validator';

import { User } from '@prisma/client';

export class LoginDto implements Pick<User, 'email' | 'password'> {
  @IsEmail()
  @IsString()
  email!: string;

  @MinLength(8)
  @IsString()
  password!: string;
}
