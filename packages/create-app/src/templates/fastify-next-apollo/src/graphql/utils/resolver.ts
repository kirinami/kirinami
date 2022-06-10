import Resolver from '../types/Resolver';
import Guard from '../types/Guard';

export default function resolver<Root, Args, Return>(resolver: Resolver<Root, Args, Return>): Resolver<Root, Args, Return>;
export default function resolver<Root, Args, Return>(guards: Guard[], resolver: Resolver<Root, Args, Return>): Resolver<Root, Args, Return>;
export default function resolver<Root, Args, Return>(resolverOrGuards: Resolver<Root, Args, Return> | Guard[], resolverOrUndefined?: Resolver<Root, Args, Return>): Resolver<Root, Args, Return> {
  return async (root, args, ctx, info) => {
    const hasGuards = Array.isArray(resolverOrGuards);

    const guards = hasGuards ? resolverOrGuards : [];
    const resolver = hasGuards ? resolverOrUndefined : resolverOrGuards;

    for (let i = 0; i < guards.length; i += 1) {
      await guards[i](root, args, ctx, info);
    }

    // @ts-ignore
    return resolver(root, args, ctx, info);
  };
}
