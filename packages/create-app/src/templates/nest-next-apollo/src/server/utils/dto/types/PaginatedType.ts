import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export default function PaginatedType<T>(classRef: Type<T>) {
  @ObjectType({
    isAbstract: true,
  })
  abstract class PaginatedTypeHost<T> {
    @Field(() => [classRef])
    items!: T[];

    @Field(() => Int)
    total!: number;
  }

  return PaginatedTypeHost as Type<PaginatedTypeHost<T>>;
}
