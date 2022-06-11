import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';

import context from '@/api/graphql/context';
import schema from '@/api/graphql/schema';

declare global {
  var apolloServer: ApolloServer | undefined;
}

function createApolloServer() {
  return new ApolloServer({
    context,
    schema,
    csrfPrevention: true,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });
}

export default async function getApolloServer() {
  if (process.env.NODE_ENV !== 'production') {
    await global.apolloServer?.stop();
  }

  const apolloServer = createApolloServer();
  await apolloServer.start();

  if (process.env.NODE_ENV !== 'production') {
    global.apolloServer = apolloServer;
  }

  return apolloServer;
}
