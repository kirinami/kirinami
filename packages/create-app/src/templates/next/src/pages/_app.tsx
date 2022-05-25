import Modal from 'react-modal';
import { AppProps } from 'next/app';

import Layout from '@/containers/layout/Layout';
import Meta from '@/containers/meta/Meta';
import EmotionProvider from '@/contexts/emotion-provider/EmotionProvider';
import ThemeProvider from '@/contexts/theme-provider/ThemeProvider';

Modal.setAppElement('#__next');

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <EmotionProvider>
      <ThemeProvider>
        <Layout>
          <Meta />
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </EmotionProvider>
  );
}
