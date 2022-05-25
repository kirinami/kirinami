import Modal from 'react-modal';
import { AppProps } from 'next/app';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

import Layout from '@/containers/layout/Layout';
import Meta from '@/containers/meta/Meta';
import Theme from '@/containers/theme/Theme';

Modal.setAppElement('#__next');

const cache = createCache({
  key: 'next',
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CacheProvider value={cache}>
      <Theme>
        <Layout>
          <Meta />
          <Component {...pageProps} />
        </Layout>
      </Theme>
    </CacheProvider>
  );
}
