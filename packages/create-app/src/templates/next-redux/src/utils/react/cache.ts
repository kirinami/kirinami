enum Status {
  UNTERMINATED,
  TERMINATED,
  ERRORED,
}

type Arg = string | number | null | void | symbol | boolean | object;

type Fn = (...args: any[]) => unknown;

type CacheNode = {
  status: Status;
  value: unknown;
  object: WeakMap<object, CacheNode> | null;
  primitive: Map<Arg, CacheNode> | null;
};

const createCacheNode = (): CacheNode => ({
  status: Status.UNTERMINATED,
  value: undefined,
  object: null,
  primitive: null,
});

const fnMap = new WeakMap<any, CacheNode>();

export function cache<A extends Arg, FN extends Fn>(fn: FN): FN {
  return ((...args: A[]) => {
    const fnNode = fnMap.get(fn);

    let cacheNode: CacheNode;
    if (fnNode === undefined) {
      cacheNode = createCacheNode();
      fnMap.set(fn, cacheNode);
    } else {
      cacheNode = fnNode;
    }

    for (let i = 0, l = args.length; i < l; i += 1) {
      const arg = args[i];

      if (typeof arg === 'function' || (typeof arg === 'object' && arg !== null)) {
        let objectCache = cacheNode.object;
        if (objectCache === null) {
          objectCache = new WeakMap<any, CacheNode>();
          cacheNode.object = objectCache;
        }

        const objectNode = objectCache.get(arg);
        if (objectNode === undefined) {
          cacheNode = createCacheNode();
          objectCache.set(arg, cacheNode);
        } else {
          cacheNode = objectNode;
        }
      } else {
        let primitiveCache = cacheNode.primitive;
        if (primitiveCache === null) {
          primitiveCache = new Map<any, CacheNode>();
          cacheNode.primitive = primitiveCache;
        }

        const primitiveNode = primitiveCache.get(arg);
        if (primitiveNode === undefined) {
          cacheNode = createCacheNode();
          primitiveCache.set(arg, cacheNode);
        } else {
          cacheNode = primitiveNode;
        }
      }
    }

    if (cacheNode.status === Status.TERMINATED) {
      return cacheNode.value;
    }

    if (cacheNode.status === Status.ERRORED) {
      throw cacheNode.value;
    }

    try {
      const result = fn(...args);

      cacheNode.status = Status.TERMINATED;
      cacheNode.value = result;

      return result;
    } catch (err) {
      cacheNode.status = Status.ERRORED;
      cacheNode.value = err;

      throw err;
    }
  }) as FN;
}
