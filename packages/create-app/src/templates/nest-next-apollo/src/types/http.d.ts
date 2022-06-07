import type * as Http from 'http';

declare module 'http' {
  import type { i18n } from 'i18next';
  import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
  import type { EmotionCache } from '@emotion/cache';

  import type { User } from '@/graphql/fragments/User';

  export interface IncomingMessage extends Http.IncomingMessage {
    pageProps: {
      apolloClient: ApolloClient<NormalizedCacheObject>,
      emotionCache: EmotionCache,
      i18n: i18n,
      user: User | null,
    };
  }
}
