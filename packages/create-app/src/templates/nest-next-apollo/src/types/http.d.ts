declare module 'http' {
  import 'http';

  import { i18n } from 'i18next';
  import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
  import { EmotionCache } from '@emotion/cache';

  import { User } from '@/graphql/fragments/User';

  export interface IncomingMessage {
    pageProps: {
      i18n: i18n,
      apolloClient: ApolloClient<NormalizedCacheObject>,
      emotionCache: EmotionCache,
      user: User | null,
    };
  }
}
