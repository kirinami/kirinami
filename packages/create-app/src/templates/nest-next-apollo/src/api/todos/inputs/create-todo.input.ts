import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { Length } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field()
  @Length(2, 32)
  title!: string;

  @Field()
  @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
  completed!: boolean;
}
