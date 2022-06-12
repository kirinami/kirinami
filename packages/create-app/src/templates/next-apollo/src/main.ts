import url from 'url';
import next from 'next';
import micro from 'micro';
import { WebSocketServer } from 'ws';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import { useServer } from 'graphql-ws/lib/use/ws';

import context from './api/graphql/context';
import schema from './api/graphql/schema';

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

  const httpServer = micro(async (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Access-Control-Allow-Origin, Content-Type, Authorization, Accept');
        res.setHeader('Access-Control-Max-Age', '86400');
        res.end();

        return;
      }
    }

    if (req.url === urls.graphql) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return apolloHandler(req, res);
    }

    return handler(req, res, url.parse(req.url!, true));
  });

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
      ApolloServerPluginLandingPageGraphQLPlayground(),
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
