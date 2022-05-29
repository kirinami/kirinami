import { IncomingHttpHeaders } from 'http';
import { NextPageContext } from 'next';
import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

import parseCookie from '@/utils/parseCookie';

let apolloClientMemo: ReturnType<typeof createApolloClient> | undefined;

const isServer = typeof window === 'undefined';

const createCache = () => new InMemoryCache();

const createAuthLink = (headers?: IncomingHttpHeaders, onSave?: () => void) => {
  const cookies = parseCookie(isServer ? headers?.cookie || '' : document.cookie);

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: cookies.accessToken ? `Bearer ${cookies.accessToken}` : '',
      },
    }));

    return forward(operation);
  });

  // if (cookies.refreshToken) {
  //   const refreshLink = onError(({ graphQLErrors, operation, forward }) => {
  //     console.log(graphQLErrors);
  //     // const errors: GraphQLErrors = Array.isArray(graphQLErrors) ? graphQLErrors : [graphQLErrors];
  //     // const unauthorizedError = errors.find((error) => error.message === 'Unauthorized');
  //     //
  //     // if (unauthorizedError) {
  //     //   return fromPromise(
  //     //     createApolloClient().mutate({
  //     //       mutation: U,
  //     //       variables: {
  //     //         refreshToken: cookies.refreshToken,
  //     //       },
  //     //       fetchPolicy: 'no-cache',
  //     //     })
  //     //       .catch(() => {}),
  //     //   ).flatMap((response) => {
  //     //     Object.assign(credentials, response?.data?.userTokenRefreshMutation);
  //     //
  //     //     operation.setContext({
  //     //       headers: {
  //     //         ...operation.getContext().headers,
  //     //         Authorization: credentials?.access_token ? `Bearer ${credentials.access_token}` : undefined,
  //     //         session: credentials?.session || undefined,
  //     //       },
  //     //     });
  //     //
  //     //     onSave();
  //     //
  //     //     return forward(operation);
  //     //   });
  //     // }
  //     //
  //     // return undefined;
  //   });
  //
  //   return from([authLink, refreshLink]);
  // }

  return authLink;
};

const createHttpLink = () => new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  credentials: 'same-origin',
});

const createApolloClient = () => new ApolloClient({
  ssrMode: isServer,
  link: createHttpLink(),
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

export default function getApolloClient(ctx?: NextPageContext, initialState?: NormalizedCacheObject) {
  const apolloClient = apolloClientMemo ?? createApolloClient();

  apolloClient.setLink(from([
    createAuthLink(ctx?.req?.headers, () => {
      // if (ctx?.res) {
      //   ctx.res.setHeader('set-cookie', [
      //     `access_token=${cookies.access_token || ''}; path=/`,
      //     `refresh_token=${cookies.refresh_token || ''}; path=/`,
      //   ]);
      // } else {
      //   document.cookie = cookie;
      // }
    }),
    createHttpLink(),
  ]));

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
}
