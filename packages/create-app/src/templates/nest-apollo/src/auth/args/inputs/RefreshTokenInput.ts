import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class RefreshTokenInput {
  @Field()
  refreshToken!: string;
}
