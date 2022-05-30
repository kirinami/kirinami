import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';

import parseCookie from '../utils/parseCookie';
import { Request } from 'express';
import { onError } from '@apollo/client/link/error';

const isServer = import.meta.env.SSR;

// @ts-ignore
const createCache = () => new InMemoryCache().restore(!isServer ? window.__APOLLO_STATE__ : undefined);

const createAuthLink = (req?: Request, onSave?: () => void) => {
  const authLink = new ApolloLink((operation, forward) => {
    const cookies = parseCookie(isServer ? req?.headers?.cookie || '' : document.cookie);

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: cookies.accessToken ? `Bearer ${cookies.accessToken}` : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNjUzODYwODkyLCJleHAiOjE2NTQ0NjU2OTJ9.EWWmIxwbqKJajx7HmQd0AvPenrsdGKXLRCWrVjH-Qbg1',
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

  return from([authLink]);
};

const createHttpLink = () => {
  return new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL,
    credentials: 'same-origin',
    fetch,
  });
};

export default function createApolloClient(req?: Request) {
  return new ApolloClient({
    ssrMode: isServer,
    ssrForceFetchDelay: isServer ? 500 : undefined,
    link: from([createAuthLink(req), createHttpLink()]),
    cache: createCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'none',
      },
      mutate: {
        fetchPolicy: 'network-only',
        errorPolicy: 'none',
      },
    },
  });
};
