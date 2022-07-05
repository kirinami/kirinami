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
  split,
} from '@apollo/client';
import { GraphQLErrors } from '@apollo/client/errors';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

import { RefreshDocument, RefreshMutation, RefreshMutationVariables } from '@/graphql/client';
import { parseCookie } from '@/utils/cookie';
import { isServer } from '@/utils/ssr';

let apolloClientMemo: ApolloClient<NormalizedCacheObject> | undefined;

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
        createApolloClient().mutate<RefreshMutation, RefreshMutationVariables>({
          mutation: RefreshDocument,
          variables: {
            token: cookies['refresh-token'],
          },
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        })
      ).flatMap((response) => {
        cookies['access-token'] = response?.data?.refresh.accessToken || '';
        cookies['refresh-token'] = response?.data?.refresh.refreshToken || '';

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
  const apolloClient = new ApolloClient({
    ssrMode: isServer,
    ssrForceFetchDelay: isServer ? 100 : undefined,
    link: createHttpLink(),
    cache: new InMemoryCache(),
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  apolloClient.toJSON = () => undefined;

  return apolloClient;
}

function createWebSocketLink(ctx?: NextPageContext | null) {
  return new GraphQLWsLink(
    createClient({
      url: String(process.env.NEXT_PUBLIC_GRAPHQL_WS_URL),
      connectionParams: async () => {
        const cookies = parseCookie(isServer ? ctx?.req?.headers?.cookie || '' : document.cookie);

        return {
          authorization: cookies['access-token'] ? `Bearer ${cookies['access-token']}` : '',
        };
      },
    })
  );
}

function createApolloLink(ctx?: NextPageContext | null) {
  const baseLink = from([createAuthLink(ctx), createHttpLink()]);

  return isServer
    ? baseLink
    : split(
        ({ query }) => {
          const definition = getMainDefinition(query);

          return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
        },
        createWebSocketLink(ctx),
        baseLink
      );
}

export default function initApolloClient(ctx?: NextPageContext | null, initialState?: NormalizedCacheObject) {
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
