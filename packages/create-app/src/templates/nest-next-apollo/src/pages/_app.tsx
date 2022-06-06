import { I18nextProvider } from 'react-i18next';
import App, { AppContext, AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { CacheProvider } from '@emotion/react';

import Meta from '@/components/Common/Meta/Meta';
import ThemeProvider from '@/components/Provider/ThemeProvider/ThemeProvider';
import { RETRIEVE_USER, RetrieveUserData, RetrieveUserVars } from '@/graphql/queries/users/retrieveUser';
import initApolloClient from '@/helpers/initApolloClient';
import initEmotionCache from '@/helpers/initEmotionCache';
import initTranslations from '@/helpers/initTranslations';

function MyApp({ Component, pageProps: { i18n, apolloClient, apolloState, emotionCache, ...pageProps } }: AppProps) {
  return (
    <ApolloProvider client={apolloClient || initApolloClient(null, apolloState)}>
      <CacheProvider value={emotionCache || initEmotionCache()}>
        <I18nextProvider i18n={i18n || initTranslations()}>
          <ThemeProvider>
            <Meta />
            <Component {...pageProps} />
          </ThemeProvider>
        </I18nextProvider>
      </CacheProvider>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const initialProps = await App.getInitialProps(appContext);

  const ctx = appContext.ctx;

  if (ctx.req) {
    const i18n = initTranslations(ctx);
    const apolloClient = initApolloClient(ctx);
    const emotionCache = initEmotionCache();

    const { data } = await apolloClient.query<RetrieveUserData | undefined, RetrieveUserVars>({
      query: RETRIEVE_USER,
      errorPolicy: 'ignore',
    });

    ctx.req.pageProps = {
      i18n,
      apolloClient,
      emotionCache,
      user: data?.retrieveUser || null,
    };
  }

  return initialProps;
};

export default MyApp;
