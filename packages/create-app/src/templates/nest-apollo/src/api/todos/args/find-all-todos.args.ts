import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindAllTodosArgs {
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  my?: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  size?: number;
}
