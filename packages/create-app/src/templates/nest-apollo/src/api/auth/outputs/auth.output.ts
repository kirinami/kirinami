import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthOutput {
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;
}
