import { useCallback, useRef } from 'react';

export default function useEventEmitter() {
  const idRef = useRef(0);

  // eslint-disable-next-line no-spaced-func
  const listenersRef = useRef<Record<string, Record<string, () => void>>>({});

  const subscribe = useCallback((type: string, listener: () => void) => {
    idRef.current += 1;
    listenersRef.current[type] = listenersRef.current[type] || {};
    listenersRef.current[type][idRef.current] = listener;

    const id = idRef.current;

    return () => {
      delete listenersRef.current[type][id];
    };
  }, []);

  const dispatch = useCallback((type: string) => {
    Object.entries(listenersRef.current[type] || {}).forEach(([, listener]) => listener());
  }, []);

  return {
    subscribe,
    dispatch,
  };
}
