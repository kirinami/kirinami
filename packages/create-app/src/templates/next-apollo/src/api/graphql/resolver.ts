import { ISchemaLevelResolver } from '@graphql-tools/utils';

import { Context } from './context';

export type Resolver<Source, Args, Return> = ISchemaLevelResolver<Source, Context, Args, Promise<Return>>;

export type Guard = Resolver<unknown, unknown, void>;

function resolver<S, A, R>(resolver: Resolver<S, A, R>): Resolver<S, A, R>;
function resolver<S, A, R>(guards: Guard[], resolver: Resolver<S, A, R>): Resolver<S, A, R>;
function resolver<S, A, R>(
  resolverOrGuards: Resolver<S, A, R> | Guard[],
  resolverOrUndefined?: Resolver<S, A, R>,
): Resolver<S, A, R> {
  return async (root, args, ctx, info) => {
    const hasGuards = Array.isArray(resolverOrGuards);

    const guards = hasGuards ? resolverOrGuards : [];
    const resolver = hasGuards ? resolverOrUndefined : resolverOrGuards;

    for (let i = 0; i < guards.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await guards[i](root, args, ctx, info);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return resolver(root, args, ctx, info);
  };
}

export default resolver;