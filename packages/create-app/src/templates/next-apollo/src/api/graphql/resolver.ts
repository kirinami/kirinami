import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';

import { User } from '@/prisma/client';

export type Context = {
  headers: Record<string, string | undefined>,
  currentUser?: User,
};

export type Resolver<S, C, A, R> = GraphQLFieldResolver<S, C, A, R | Promise<R>>;

export default function resolver<S = unknown, C = Context, A = Record<string, never>, R = unknown>(
  ...resolvers: [...Resolver<S, C, A, void>[], Resolver<S, C, A, R>]
) {
  return (source: S, args: A, ctx: C, info: GraphQLResolveInfo) => resolvers.reduce<Promise<Resolver<S, C, A, R> | unknown>>(
    (promise, resolver) => promise.then(() => resolver(source, args, ctx, info)),
    Promise.resolve(),
  );
}
