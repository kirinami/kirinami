import { AppProps } from 'next/app';
import withApollo from 'next-with-apollo';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';

import Meta from '@/components/Meta/Meta';
import EmotionProvider from '@/components/Provider/EmotionProvider/EmotionProvider';
import ThemeProvider from '@/components/Provider/ThemeProvider/ThemeProvider';
import getApolloClient from '@/helpers/getApolloClient';
import getEmotionServer from '@/helpers/getEmotionServer';

type MyAppProps = AppProps & {
  apollo: ApolloClient<NormalizedCacheObject>,
};

function MyApp({ Component, pageProps, apollo }: MyAppProps) {
  return (
    <ApolloProvider client={apollo}>
      <EmotionProvider>
        <ThemeProvider>
          <Meta />
          <Component {...pageProps} />
        </ThemeProvider>
      </EmotionProvider>
    </ApolloProvider>
  );
}

export default withApollo(
  ({ ctx, initialState }) => [getApolloClient(ctx, initialState), getEmotionServer()][0],
  { getDataFromTree },
)(MyApp);
