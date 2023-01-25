import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class AuthType {
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;
}
