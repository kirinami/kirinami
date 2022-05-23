import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsBoolean, Length } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field()
  @Length(2, 32)
  title!: string;

  @Field()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
  completed!: boolean;
}
