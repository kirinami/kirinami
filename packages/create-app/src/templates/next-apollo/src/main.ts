import url from 'url';
import next from 'next';
import micro, { send } from 'micro';
import cors from 'micro-cors';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import context from './server/graphql/context';
import schema from './server/graphql/schema';

async function main() {
  const urls = {
    graphql: '/graphql',
  };

  const app = next({
    dev: process.env.NODE_ENV !== 'production',
    hostname: '0.0.0.0',
    port: 3000,
  });
  const handler = app.getRequestHandler();

  await app.prepare();

  const httpServer = micro(cors()((req, res) => {
    if (req.method === 'OPTIONS') {
      return send(res, 204);
    }

    if (req.url === urls.graphql) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return apolloHandler(req, res);
    }

    return handler(req, res, url.parse(req.url!, true));
  }));

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: urls.graphql,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const serverCleanup = useServer({
    context: ({ connectionParams }) => context({ headers: connectionParams || {} }),
    schema,
  }, wsServer);

  const apolloServer = new ApolloServer({
    context: ({ req }) => context({ headers: req.headers }),
    schema,
    csrfPrevention: true,
    introspection: true,
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

  const apolloHandler = apolloServer.createHandler({
    path: urls.graphql,
  });

  httpServer.listen(app.port, app.hostname, () => {
    console.log(`🚀 Server ready at http://localhost:${app.port}`);
  });
}

main()
  .catch(console.error);
