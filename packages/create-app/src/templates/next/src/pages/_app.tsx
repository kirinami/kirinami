import { AppProps } from 'next/app';

import Meta from '@/components/Meta/Meta';
import EmotionProvider from '@/components/Provider/EmotionProvider/EmotionProvider';
import ThemeProvider from '@/components/Provider/ThemeProvider/ThemeProvider';

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
