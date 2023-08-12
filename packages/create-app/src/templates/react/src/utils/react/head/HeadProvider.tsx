import { createContext, ReactNode, useContext, useMemo } from 'react';

import { Head, headToDom, resolveHead } from './head';

const HeadContext = createContext<Head>({});

export type HeadProviderProps = {
  context?: Head;
  children: ReactNode;
};

export function HeadProvider({ context = {}, children }: HeadProviderProps) {
  const value = useMemo(() => context, []);

  return <HeadContext.Provider value={value}>{children}</HeadContext.Provider>;
}

export function useHead(next: Head) {
  const curr = useContext(HeadContext);

  const result = resolveHead(curr, next);

  if (!import.meta.env.SSR) {
    headToDom(result);
  }

  return Object.assign(curr, result);
}
