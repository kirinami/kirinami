import { IncomingHttpHeaders } from 'http';
import { NextPageContext } from 'next';
import { ApolloClient, ApolloLink, from, fromPromise, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { GraphQLErrors } from '@apollo/client/errors';
import { onError } from '@apollo/client/link/error';

import { REFRESH, RefreshData } from '@/graphql/mutations/auth/refresh';
import parseCookie from '@/utils/parseCookie';

let apolloClientMemo: ReturnType<typeof createApolloClient> | undefined;

const isServer = typeof window === 'undefined';

const createCache = () => new InMemoryCache();

const createAuthLink = (ctx?: NextPageContext | null) => {
  const authLink = new ApolloLink((operation, forward) => {
    const cookies = parseCookie(isServer ? ctx?.req?.headers?.cookie || '' : document.cookie);

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: cookies['access-token'] ? `Bearer ${cookies['access-token']}` : '',
      },
    }));

    return forward(operation);
  });

  const refreshLink = onError(({ graphQLErrors, operation, forward }) => {
    const errors: GraphQLErrors = Array.isArray(graphQLErrors) ? graphQLErrors : [graphQLErrors];
    const unauthorizedError = errors.find((error) => error?.message === 'Unauthorized');

    if (unauthorizedError) {
      const cookies = parseCookie(isServer ? ctx?.req?.headers?.cookie || '' : document.cookie);

      return fromPromise(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        createApolloClient({
          'refresh-token': cookies['refresh-token'],
        })
          .mutate<RefreshData>({
            mutation: REFRESH,
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
          }),
      ).flatMap((response) => {
        cookies['access-token'] = response?.data?.refresh.accessToken || '';
        cookies['refresh-token'] = response?.data?.refresh.refreshToken || '';

        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            authorization: cookies['access-token'] ? `Bearer ${cookies['access-token']}` : '',
          },
        }));

        if (isServer) {
          ctx?.res?.setHeader('set-cookie', [
            `access-token=${cookies['access-token'] || ''}; path=/`,
            `refresh-token=${cookies['refresh-token'] || ''}; path=/`,
          ]);
        } else {
          document.cookie = `access-token=${cookies['access-token'] || ''}; path=/;`;
          document.cookie = `refresh-token=${cookies['refresh-token'] || ''}; path=/;`;
        }

        return forward(operation);
      });
    }

    return undefined;
  });

  return from([authLink, refreshLink]);
};

const createHttpLink = (headers?: IncomingHttpHeaders) => new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  credentials: 'same-origin',
  headers,
});

const createApolloClient = (headers?: IncomingHttpHeaders) => new ApolloClient({
  ssrMode: isServer,
  ssrForceFetchDelay: isServer ? 100 : undefined,
  link: createHttpLink(headers),
  cache: createCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'none',
    },
    mutate: {
      fetchPolicy: 'network-only',
      errorPolicy: 'none',
    },
  },
});

export default function initApolloClient(ctx?: NextPageContext | null, initialState?: NormalizedCacheObject) {
  const apolloClient = apolloClientMemo ?? createApolloClient();

  apolloClient.setLink(from([
    createAuthLink(ctx),
    createHttpLink(),
  ]));

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  apolloClient.toJSON = () => undefined;

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
