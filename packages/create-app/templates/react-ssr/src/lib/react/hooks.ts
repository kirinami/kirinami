import { useSyncExternalStore } from 'react';

const unsubscribe = () => undefined;

const subscribe = () => unsubscribe;

export function useIsHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
