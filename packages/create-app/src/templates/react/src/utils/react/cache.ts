const UNTERMINATED = 0;
const TERMINATED = 1;
const ERRORED = 2;

let currentCache: Map<typeof createCacheRoot, ReturnType<typeof createCacheRoot>> | null = null;

function createCacheRoot() {
  return new WeakMap();
}

function createCacheNode() {
  return {
    s: UNTERMINATED,
    v: undefined,
    o: null,
    p: null,
  };
}

function getCacheForType(resourceType: typeof createCacheRoot) {
  const cache = currentCache ?? new Map();

  if (!import.meta.env.SSR) {
    currentCache = cache;
  }

  let entry = cache.get(resourceType);

  if (entry === undefined) {
    entry = resourceType();

    cache.set(resourceType, entry);
  }

  return entry;
}

export function cache(fn: (...args: unknown[]) => unknown) {
  return function (...args: unknown[]) {
    const fnMap = getCacheForType(createCacheRoot);
    const fnNode = fnMap.get(fn);
    let cacheNode;

    if (fnNode === undefined) {
      cacheNode = createCacheNode();
      fnMap.set(fn, cacheNode);
    } else {
      cacheNode = fnNode;
    }

    for (let i = 0, l = args.length; i < l; i += 1) {
      const arg = args[i];

      if (typeof arg === 'function' || (typeof arg === 'object' && arg !== null)) {
        // Objects go into a WeakMap
        let objectCache = cacheNode.o as WeakMap<object, unknown>;

        if (objectCache === null) {
          objectCache = new WeakMap();

          cacheNode.o = objectCache;
        }

        const objectNode = objectCache.get(arg);

        if (objectNode === undefined) {
          cacheNode = createCacheNode();
          objectCache.set(arg, cacheNode);
        } else {
          cacheNode = objectNode;
        }
      } else {
        // Primitives go into a regular Map
        let primitiveCache = cacheNode.p as Map<unknown, unknown>;

        if (primitiveCache === null) {
          primitiveCache = new Map();

          cacheNode.p = primitiveCache;
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

    if (cacheNode.s === TERMINATED) {
      return cacheNode.v;
    }

    if (cacheNode.s === ERRORED) {
      throw cacheNode.v;
    }

    try {
      const result = fn(args);
      const terminatedNode = cacheNode;
      terminatedNode.s = TERMINATED;
      terminatedNode.v = result;
      return result;
    } catch (error) {
      const erroredNode = cacheNode;
      erroredNode.s = ERRORED;
      erroredNode.v = error;
      throw error;
    }
  };
}
