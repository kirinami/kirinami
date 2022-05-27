import { AppProps } from 'next/app';

import Meta from '@/components/Meta/Meta';
import EmotionProvider from '@/components/Provider/EmotionProvider/EmotionProvider';
import ThemeProvider from '@/components/Provider/ThemeProvider/ThemeProvider';
import AuthProvider from '@/components/Provider/AuthProvider/AuthProvider';

export default function MyApp({ Component, pageProps: { user, ...props } }: AppProps) {
  return (
    <EmotionProvider>
      <ThemeProvider>
        <AuthProvider user={user}>
          <Meta />
          <Component {...props} />
        </AuthProvider>
      </ThemeProvider>
    </EmotionProvider>
  );
}
