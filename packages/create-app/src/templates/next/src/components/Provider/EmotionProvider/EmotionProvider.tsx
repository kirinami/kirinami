import { ReactNode } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

export const emotionCache = createCache({
  key: 'app',
});

export type EmotionProviderProps = {
  children: ReactNode,
};

export default function EmotionProvider({ children }: EmotionProviderProps) {
  return (
    <CacheProvider value={emotionCache}>
      {children}
    </CacheProvider>
  );
}
