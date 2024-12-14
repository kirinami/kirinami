import { createContext, ReactNode, useMemo } from 'react';

import { Head } from './head';

export const HeadContext = createContext<Head>({});

export type HeadProviderProps = {
  context?: Head;
  children: ReactNode;
};

export function HeadProvider({ context = {}, children }: HeadProviderProps) {
  const value = useMemo(() => context, []);

  return <HeadContext.Provider value={value}>{children}</HeadContext.Provider>;
}
