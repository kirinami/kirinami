import { I18nextProvider } from 'react-i18next';
import App, { AppContext, AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { CacheProvider } from '@emotion/react';

import Meta from '@/components/Common/Meta/Meta';
import AuthProvider from '@/components/Provider/AuthProvider/AuthProvider';
import ThemeProvider from '@/components/Provider/ThemeProvider/ThemeProvider';
import initApolloClient from '@/helpers/initApolloClient';
import initEmotionCache from '@/helpers/initEmotionCache';
import initTranslations from '@/helpers/initTranslations';

function MyApp({
  pageProps: { i18n, apolloClient, apolloState, emotionCache, ...pageProps },
  Component,
}: AppProps) {
  return (
    <ApolloProvider client={apolloClient || initApolloClient(null, apolloState)}>
      <CacheProvider value={emotionCache || initEmotionCache()}>
        <I18nextProvider i18n={i18n || initTranslations()}>
          <AuthProvider>
            <ThemeProvider>
              <Meta />
              <Component {...pageProps} />
            </ThemeProvider>
          </AuthProvider>
        </I18nextProvider>
      </CacheProvider>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const { ctx } = appContext;

  const initialProps = await App.getInitialProps(appContext);

  const apolloClient = initApolloClient(ctx);
  const emotionCache = initEmotionCache();
  const i18n = initTranslations(ctx);

  Object.assign(initialProps.pageProps, {
    i18n,
    apolloClient,
    emotionCache,
  });

  if (ctx.req) ctx.req.pageProps = initialProps.pageProps;

  return initialProps;
};

export default MyApp;
