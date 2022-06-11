import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindAllUsersArgs {
  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  size?: number;
}
