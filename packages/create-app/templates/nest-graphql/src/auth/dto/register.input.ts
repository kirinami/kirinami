import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

import { User } from '@prisma/client';

@InputType()
export class RegisterInput implements Pick<User, 'email' | 'password'> {
  @IsEmail()
  @Field()
  email!: string;

  @MinLength(8)
  @Field()
  password!: string;
}
