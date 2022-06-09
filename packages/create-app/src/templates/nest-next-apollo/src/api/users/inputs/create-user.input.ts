import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEmail, IsEnum, IsOptional, Length } from 'class-validator';

import { Role } from '../enums/role.enum';

@InputType()
export class CreateUserInput {
  @Field()
  @Length(2, 32)
  firstName!: string;

  @Field()
  @Length(2, 32)
  lastName!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Length(8)
  password!: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsEnum(Role, { each: true })
  @IsOptional()
  roles!: Role[];
}
