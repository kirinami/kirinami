import { AppProps } from 'next/app';

import Meta from '@/containers/meta/Meta';
import EmotionProvider from '@/contexts/emotion-provider/EmotionProvider';
import ThemeProvider from '@/contexts/theme-provider/ThemeProvider';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <EmotionProvider>
      <ThemeProvider>
        <Meta />
        <Component {...pageProps} />
      </ThemeProvider>
    </EmotionProvider>
  );
}
