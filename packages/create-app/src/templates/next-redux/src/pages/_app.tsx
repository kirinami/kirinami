import { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import App, { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { CacheProvider } from '@emotion/react';

import { Meta } from '@/components/Meta';
import { Styles } from '@/components/Styles';
import { initApolloClient } from '@/helpers/initApolloClient';
import { initEmotionCache } from '@/helpers/initEmotionCache';
import { initI18n } from '@/helpers/initI18n';

function MyApp({ pageProps: { apolloClient, i18n, initialState, ...pageProps }, Component }: AppProps) {
  const emotionCacheMemo = useMemo(() => initEmotionCache(), []);

  const apolloClientMemo = useMemo(
    () => apolloClient || initApolloClient(null, initialState?.apolloClient),
    [apolloClient, initialState?.apolloClient]
  );

  const i18nMemo = useMemo(() => i18n || initI18n(null, initialState?.i18n), [i18n, initialState?.i18n]);

  return (
    <CacheProvider value={emotionCacheMemo}>
      <ApolloProvider client={apolloClientMemo}>
        <I18nextProvider i18n={i18nMemo}>
          <Meta />
          <Styles />
          <Component {...pageProps} />
        </I18nextProvider>
      </ApolloProvider>
    </CacheProvider>
  );
}

MyApp.getInitialProps = App.getInitialProps;

export default MyApp;
