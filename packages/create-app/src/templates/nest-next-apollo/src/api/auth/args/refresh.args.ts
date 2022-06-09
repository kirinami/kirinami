import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class RefreshArgs {
  @Field(() => String)
  token!: string;
}
