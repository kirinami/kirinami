import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

let apolloClientMemo: ReturnType<typeof createApolloClient> | undefined;

export const isServer = typeof window === 'undefined';

export const createLink = () => new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  credentials: 'same-origin',
  headers: {
    Authorization: '',
  },
});

export const createCache = () => new InMemoryCache();

export const createApolloClient = () => new ApolloClient({
  ssrMode: isServer,
  link: createLink(),
  cache: createCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export const initApolloClient = (initialState?: NormalizedCacheObject) => {
  const apolloClient = apolloClientMemo ?? createApolloClient();

  if (initialState) {
    const existingCache = apolloClient.extract();

    apolloClient.restore({
      ...existingCache,
      ...initialState,
    });
  }

  if (isServer) {
    return apolloClient;
  }

  if (!apolloClientMemo) {
    apolloClientMemo = apolloClient;
  }

  return apolloClient;
};

export default initApolloClient;
