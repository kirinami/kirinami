import { I18nextProvider } from 'react-i18next';
import App, { AppContext, AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { CacheProvider } from '@emotion/react';

import Meta from '@/components/Common/Meta/Meta';
import ThemeProvider from '@/components/Provider/ThemeProvider/ThemeProvider';
import initApolloClient from '@/helpers/initApolloClient';
import initEmotionCache from '@/helpers/initEmotionCache';
import initTranslations from '@/helpers/initTranslations';

function MyApp({ Component, pageProps: { apolloClient, apolloState, emotionCache, translations, ...pageProps } }: AppProps) {
  return (
    <ApolloProvider client={apolloClient || initApolloClient(null, apolloState)}>
      <CacheProvider value={emotionCache || initEmotionCache()}>
        <I18nextProvider i18n={translations || initTranslations()}>
          <ThemeProvider>
            <Meta />
            <Component {...pageProps} />
          </ThemeProvider>
        </I18nextProvider>
      </CacheProvider>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => App.getInitialProps(appContext);

export default MyApp;
