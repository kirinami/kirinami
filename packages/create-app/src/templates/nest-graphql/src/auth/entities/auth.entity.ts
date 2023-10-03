import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthEntity {
  @Field(() => String)
  accessToken!: string;

  @Field(() => String)
  refreshToken!: string;
}
