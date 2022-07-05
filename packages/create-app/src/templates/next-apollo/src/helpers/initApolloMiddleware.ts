import http, { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import { WebSocketServer } from 'ws';
import { Disposable } from 'graphql-ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { graphqlUploadKoa } from 'graphql-upload';
import { mapKeys } from 'lodash';

import schema from '@/graphql/resolvers/schema';

declare global {
  // eslint-disable-next-line no-var,vars-on-top
  var webSocketServer: WebSocketServer | undefined;

  // eslint-disable-next-line no-var,vars-on-top
  var subscriptionServer: Disposable | undefined;

  // eslint-disable-next-line no-var,vars-on-top
  var apolloServer: ApolloServer | undefined;

  // eslint-disable-next-line no-var,vars-on-top
  var httpServer: http.Server | undefined;

  // eslint-disable-next-line no-var,vars-on-top
  var handleUpgrade: (req: IncomingMessage, socket: Duplex, head: Buffer) => void;
}

async function createWebSocketServer(path: string) {
  global.webSocketServer?.close();

  const webSocketServer = new WebSocketServer({
    path,
    noServer: true,
  });

  if (process.env.NODE_ENV !== 'production') {
    global.webSocketServer = webSocketServer;
  }

  return webSocketServer;
}

async function createSubscriptionServer(webSocketServer: WebSocketServer) {
  await global.subscriptionServer?.dispose();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const subscriptionServer = useServer(
    {
      context: ({ connectionParams }) => ({
        headers: mapKeys(connectionParams || {}, (_, key) => key.toLowerCase()),
      }),
      schema,
    },
    webSocketServer
  );

  if (process.env.NODE_ENV !== 'production') {
    global.subscriptionServer = subscriptionServer;
  }

  return subscriptionServer;
}

async function createApolloServer() {
  await global.apolloServer?.stop();

  const apolloServer = new ApolloServer({
    context: ({ ctx }) => ({ headers: ctx.req.headers }),
    schema,
    csrfPrevention: true,
    introspection: process.env.NODE_ENV !== 'production',
  });

  await apolloServer.start();

  if (process.env.NODE_ENV !== 'production') {
    global.apolloServer = apolloServer;
  }

  return apolloServer;
}

export default async function initApolloMiddleware({ path }: { path: string }) {
  const webSocketServer = await createWebSocketServer(path);
  const subscriptionServer = await createSubscriptionServer(webSocketServer);
  const apolloServer = await createApolloServer();

  global.httpServer?.off('upgrade', global.handleUpgrade);
  global.httpServer = undefined;

  const handleUpgrade = (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    if (req.url === path) {
      webSocketServer.handleUpgrade(req, socket, head, (ws) => {
        webSocketServer.emit('connection', ws, req);
      });
    }
  };

  if (process.env.NODE_ENV !== 'production') {
    global.handleUpgrade = handleUpgrade;
  }

  const app = new Koa().use(async (ctx, next) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const httpServer = ctx.socket.server as http.Server;

    if (httpServer !== global.httpServer) {
      global.httpServer = httpServer.on('upgrade', handleUpgrade);
    }

    if (ctx.url === path) {
      return graphqlUploadKoa()(ctx, next);
    }

    await next();
  });

  apolloServer.applyMiddleware({
    path,
    app,
  });

  return app.callback();
}
