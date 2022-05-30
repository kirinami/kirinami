import { ReactNode } from 'react';
import { CacheProvider } from '@emotion/react';

import { emotionCache } from '@/helpers/getEmotionServer';

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
