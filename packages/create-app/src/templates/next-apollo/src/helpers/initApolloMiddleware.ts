import { ApolloServer } from 'apollo-server-koa';
import { WebSocketServer } from 'ws';
import { Disposable } from 'graphql-ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { mapKeys } from 'lodash';
import Koa from 'koa';
import { graphqlUploadKoa } from 'graphql-upload';

import schema from '@/api/graphql/schema';

declare global {
  // eslint-disable-next-line no-var,vars-on-top
  var wsServer: WebSocketServer | undefined;

  // eslint-disable-next-line no-var,vars-on-top
  var wsCleanup: Disposable | undefined;

  // eslint-disable-next-line no-var,vars-on-top
  var apolloServer: ApolloServer | undefined;
}

export default async function initApolloMiddleware({ path }: { path: string }) {
  await global.wsServer?.close();

  // eslint-disable-next-line no-multi-assign
  const wsServer = global.wsServer = new WebSocketServer({
    path,
    port: 4000,
  });

  //

  await global.wsCleanup?.dispose();

  // eslint-disable-next-line react-hooks/rules-of-hooks,no-multi-assign
  const wsCleanup = global.wsCleanup = useServer({
    context: ({ connectionParams }) => ({ headers: mapKeys(connectionParams || {}, (_, key) => key.toLowerCase()) }),
    schema,
  }, wsServer);

  //

  await global.apolloServer?.stop();

  // eslint-disable-next-line no-multi-assign
  const apolloServer = global.apolloServer = new ApolloServer({
    context: ({ ctx }) => ({ headers: ctx.req.headers }),
    schema,
    csrfPrevention: true,
    introspection: process.env.NODE_ENV !== 'production',
  });
  await apolloServer.start();

  //

  const app = new Koa()
    .use(graphqlUploadKoa());

  apolloServer.applyMiddleware({ app, path });

  return app.callback();
}
