import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export default function PaginationType<T>(classRef: Type<T>) {
  @ObjectType({
    isAbstract: true,
  })
  abstract class PaginationTypeHost<T> {
    @Field(() => [classRef])
    items!: T[];

    @Field(() => Int)
    total!: number;
  }

  return PaginationTypeHost as Type<PaginationTypeHost<T>>;
}
