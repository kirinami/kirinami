import { Request } from 'express';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { getMarkupFromTree } from '@apollo/client/react/ssr';
import { ApolloProvider } from '@apollo/client';
import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';
import { CacheProvider } from '@emotion/react';

import createApolloClient from './helpers/createApolloClient';
import App from './pages/App';
import { Writable } from 'stream';
import { renderToPipeableStream } from 'react-dom/server';

const cache = createCache({
  key: 'css',
});

const emotionServer = createEmotionServer(cache);

export async function render(req: Request, url: string, routerContext: any, helmetContext: any) {
  const apolloClient = createApolloClient(req);

  const Tree = (
    <ApolloProvider client={apolloClient}>
      <StaticRouter location={url} context={routerContext}>
        <HelmetProvider context={helmetContext}>
          <CacheProvider value={cache}>
            <App />
          </CacheProvider>
        </HelmetProvider>
      </StaticRouter>
    </ApolloProvider>
  );

  const html = await getMarkupFromTree({
    tree: Tree,
    renderFunction: async (Tree) => new Promise((resolve, reject) => {
      let error: Error | null = null;
      let html = '';

      const end = new Writable({
        write(chunk, encoding, next) {
          html += chunk.toString();
          next(error);
        },
      });
      end.on('finish', () => resolve(html));
      end.on('error', (err) => reject(err));

      const stream = renderToPipeableStream(
        Tree,
        {
          onAllReady() {
            stream.pipe(end);
          },
          onError(err) {
            error = err as Error || null;
            console.error(err);
          },
        },
      );
    }),
  });

  // const html = await getMarkupFromTree({
  //   tree: Tree,
  //   renderFunction: (Tree) => renderToString(Tree)
  // });

  const chunks = emotionServer.extractCriticalToChunks(html);
  const styles = emotionServer.constructStyleTagsFromChunks(chunks);

  const apolloState = apolloClient.extract();

  return {
    html,
    styles,
    apolloState,
  };
}
