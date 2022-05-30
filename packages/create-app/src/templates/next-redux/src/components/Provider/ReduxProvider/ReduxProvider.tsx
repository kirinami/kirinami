import { DependencyList, useEffect } from 'react';
import { Provider } from 'react-redux';

import getReduxStore from '@/helpers/getReduxStore';

export const context = {
  requests: [] as any[],
};

export default function ReduxProvider({ state, children }: any) {
  return (
    <Provider store={getReduxStore(state)}>
      {children}
    </Provider>
  );
}

/* */

export function useServerEffect(name: string, effect: () => Promise<void>, deps?: DependencyList) {
  if (typeof window === 'undefined') {
    context.requests.push(effect);
  }

  useEffect(() => {
    effect();
  }, deps);
}
