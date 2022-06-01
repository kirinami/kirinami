import App, { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { CacheProvider } from '@emotion/react';

import Meta from '@/components/Common/Meta/Meta';
import ThemeProvider from '@/components/Provider/ThemeProvider/ThemeProvider';
import getApolloClient from '@/helpers/getApolloClient';
import getEmotionCache from '@/helpers/getEmotionCache';

function MyApp({ Component, pageProps: { apolloClient, apolloState, ...pageProps } }: AppProps) {
  return (
    <ApolloProvider client={apolloClient || getApolloClient(null, apolloState)}>
      <CacheProvider value={getEmotionCache()}>
        <ThemeProvider>
          <Meta />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = App.getInitialProps;

export default MyApp;
