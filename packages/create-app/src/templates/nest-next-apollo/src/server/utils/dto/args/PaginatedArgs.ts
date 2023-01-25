import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, Max, Min } from 'class-validator';

export default function PaginatedArgs() {
  @ArgsType()
  abstract class PaginatedArgsHost {
    @Field(() => Int, { nullable: true })
    @Min(1)
    @IsNumber()
    page = 1;

    @Field(() => Int, { nullable: true })
    @Max(100)
    @Min(1)
    @IsNumber()
    size = 10;
  }

  return PaginatedArgsHost;
}
