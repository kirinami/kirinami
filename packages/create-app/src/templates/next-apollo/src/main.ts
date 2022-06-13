import http from 'http';
import next from 'next';
import Koa from 'koa';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-koa';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { graphqlUploadKoa } from 'graphql-upload';
import { mapKeys } from 'lodash';

import schema from './server/graphql/schema';

async function main() {
  const urls = {
    graphql: '/graphql',
  };

  const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
    customServer: true,
    hostname: '0.0.0.0',
    port: 3000,
  });
  const nextHandler = nextApp.getRequestHandler();
  await nextApp.prepare();

  const httpServer = http.createServer();

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: urls.graphql,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const serverCleanup = useServer({
    context: ({ connectionParams }) => ({ headers: mapKeys(connectionParams || {}, (_, key) => key.toLowerCase()) }),
    schema,
  }, wsServer);

  const apolloServer = new ApolloServer({
    context: ({ ctx }) => ({ headers: ctx.req.headers }),
    schema,
    csrfPrevention: true,
    introspection: process.env.NODE_ENV !== 'production',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await apolloServer.start();

  const koaApp = new Koa();

  koaApp.use(graphqlUploadKoa());

  apolloServer.applyMiddleware({
    app: koaApp,
    path: urls.graphql,
  });

  koaApp.use(async (ctx) => {
    ctx.respond = false;
    await nextHandler(ctx.req, ctx.res);
  });

  httpServer.on('request', koaApp.callback());

  httpServer.listen(nextApp.port, nextApp.hostname, () => {
    console.log(`🚀 Server ready at http://localhost:${nextApp.port}`);
  });
}

main()
  .catch(console.error);
