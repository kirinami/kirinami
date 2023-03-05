import { NextPageContext } from 'next';
import {
  ApolloClient,
  ApolloLink,
  Context,
  from,
  fromPromise,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { GraphQLErrors } from '@apollo/client/errors';
import { onError } from '@apollo/client/link/error';
import { v5 } from 'uuid';

import { RefreshTokenDocument, RefreshTokenMutation, RefreshTokenMutationVariables } from '@/graphql/client';
import { parseCookie } from '@/utils/cookie';
import { isServer } from '@/utils/ssr';

let apolloClientMemo: ReturnType<typeof createApolloClient> | undefined;

function createAuthLink(ctx?: NextPageContext | null) {
  const authLink = new ApolloLink((operation, forward) => {
    const cookies = parseCookie(isServer ? ctx?.req?.headers?.cookie || '' : document.cookie);

    operation.setContext((ctx: Context) => ({
      ...ctx,
      headers: {
        ...(ctx.headers || {}),
        authorization: cookies['access-token'] ? `Bearer ${cookies['access-token']}` : '',
      },
    }));

    return forward(operation);
  });

  const refreshLink = onError(({ graphQLErrors, operation, forward }) => {
    const errors: GraphQLErrors = Array.isArray(graphQLErrors) ? graphQLErrors : [graphQLErrors];
    const unauthorizedError = errors.find((error) => error?.message === 'Not authenticated');

    if (unauthorizedError) {
      const cookies = parseCookie(isServer ? ctx?.req?.headers?.cookie || '' : document.cookie);

      if (!cookies['refresh-token']) {
        return undefined;
      }

      return fromPromise(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        createApolloClient().mutate<RefreshTokenMutation, RefreshTokenMutationVariables>({
          mutation: RefreshTokenDocument,
          variables: {
            input: {
              refreshToken: cookies['refresh-token'],
            },
          },
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        })
      ).flatMap((response) => {
        cookies['access-token'] = response?.data?.refreshToken.accessToken || '';
        cookies['refresh-token'] = response?.data?.refreshToken.refreshToken || '';

        operation.setContext((ctx: Context) => ({
          ...ctx,
          headers: {
            ...(ctx.headers || {}),
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
}

function createHttpLink() {
  return new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL,
    credentials: 'same-origin',
  });
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: isServer,
    ssrForceFetchDelay: isServer ? 100 : undefined,
    link: createHttpLink(),
    cache: new InMemoryCache({
      dataIdFromObject(object, context) {
        const NS = '40e1d236-d2d4-46ec-bd0c-6ceb0e83d43b';

        return object.id ? `${context.typename}:${object.id}:${v5(Object.keys(object).join(','), NS)}` : undefined;
      },
    }),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
        fetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: true,
      },
      query: {
        errorPolicy: 'all',
        fetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: true,
      },
      mutate: {
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      },
    },
  });
}

function createApolloLink(ctx?: NextPageContext | null) {
  return from([createAuthLink(ctx), createHttpLink()]);
}

export function initApolloClient(ctx?: NextPageContext | null, initialState?: NormalizedCacheObject) {
  const apolloClient = apolloClientMemo ?? createApolloClient();

  if (!apolloClientMemo) {
    apolloClient.onResetStore(async () => {
      apolloClient.setLink(createApolloLink(ctx));
    });

    apolloClient.setLink(createApolloLink(ctx));
  }

  if (initialState) {
    const existingCache = apolloClient.extract();

    apolloClient.restore({
      ...existingCache,
      ...initialState,
      ROOT_QUERY: {
        ...(existingCache.ROOT_QUERY || {}),
        ...(initialState.ROOT_QUERY || {}),
      },
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
