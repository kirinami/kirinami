import { renderToReadableStream } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { dehydrate, FetchQueryOptions, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DEFAULT_LANGUAGE } from '@/helpers/createI18n';
import { LanguageLoaderData } from '@/providers/LanguageProvider';
import { useAppStore } from '@/stores/useAppStore';
import { escapeJson } from '@/utils/lib/react/server';
import { render } from '@/utils/lib/react/server/render';

import { Document } from './Document';
import { createRoutes } from './routes';

export async function handler(request: Request, assets: { style: string; entry: string }) {
  const routes = createRoutes();
  const handler = createStaticHandler(routes);

  const context = await handler.query(request);

  if (context instanceof Response) {
    return context;
  }

  const router = createStaticRouter(handler.dataRoutes, context);

  const language = (router.state.loaderData.Language as LanguageLoaderData | undefined)?.language ?? DEFAULT_LANGUAGE;

  const queryCache = new QueryCache();

  const queryClient = new QueryClient({
    queryCache,
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
      },
    },
  });

  useAppStore.setState({
    language,
  });

  const children = (
    <Document assets={assets} language={language}>
      <QueryClientProvider client={queryClient}>
        <StaticRouterProvider context={context} router={router} />
      </QueryClientProvider>
    </Document>
  );

  const stream = await render(children, {
    onRender: async (children) => {
      const queryState = dehydrate(queryClient);

      const appState = useAppStore.getState();

      const stream = await renderToReadableStream(children, {
        bootstrapScriptContent: `
          window.__staticAssetsHydrationData = JSON.parse(${escapeJson(assets)});
          window.__staticQueryClientHydrationData = JSON.parse(${escapeJson(queryState)});
          window.__staticAppStoreHydrationData = JSON.parse(${escapeJson(appState)});
        `,
        bootstrapModules: [assets.entry],
        onError: (error) => {
          console.error('onError:', error);
        },
      });

      await stream.allReady;

      return stream;
    },
    onCollect: (renderPromises) => {
      queryCache
        .findAll({
          predicate: (query) =>
            !(
              query.meta?.ssr === false ||
              query.options.queryFn == null ||
              ('enabled' in query.options && query.options.enabled === false) ||
              ('suspense' in query.options && query.options.suspense === true) ||
              query.state.status !== 'pending'
            ),
        })
        .forEach((query) =>
          renderPromises.addQueryPromise(query.queryHash, () =>
            queryClient.prefetchQuery(query.options as FetchQueryOptions),
          ),
        );
    },
  });

  return new Response(stream, {
    status: context.statusCode,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
