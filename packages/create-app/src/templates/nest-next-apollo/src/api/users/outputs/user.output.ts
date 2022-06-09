import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';

import { Role } from '../enums/role.enum';

@ObjectType()
export class UserOutput {
  @Field(() => Int)
  id!: number;

  @Field()
  email!: string;

  @HideField()
  password!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field(() => [String])
  roles!: Role[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
