/* eslint-disable @typescript-eslint/no-throw-literal */

import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom';
import {
  dehydrate,
  FetchQueryOptions,
  Query,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import type { Manifest } from 'vite';

import { DEFAULT_LANGUAGE } from '@/helpers/createI18n';
import { AppStoreProvider, createAppStore } from '@/stores/useAppStore';
import { escapeJson, getMarkupFromTree } from '@/utils/react/ssr/server';

import { Document } from './Document';
import { routes } from './main';

const handler = createStaticHandler(routes);

export async function render(manifest: Manifest, request: Request) {
  const entry = manifest['src/entry.client.tsx'];

  const context = {
    router: await handler.query(request),
  };

  if (context.router instanceof Response) {
    throw context.router;
  }

  const router = createStaticRouter(handler.dataRoutes, context.router);
  const language = router.state.loaderData.HydrationProvider?.state.i18n.language || DEFAULT_LANGUAGE;

  const queryCache = new QueryCache();

  const queryClient = new QueryClient({
    queryCache,
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
      },
    },
  });

  const appStore = createAppStore({
    language,
  });

  const root = await getMarkupFromTree(
    <Document language={language}>
      <QueryClientProvider client={queryClient}>
        <AppStoreProvider store={appStore}>
          <StaticRouterProvider context={context.router} router={router} />
        </AppStoreProvider>
      </QueryClientProvider>
    </Document>,
    {
      bootstrapModules: [`/${entry.file}`],
      onAfterRender: (renderPromises) => {
        renderPromises.addQueryPromise('queryClient', async () => {
          const predicate = (query: Query) =>
            !(
              query.meta?.ssr === false ||
              query.options.queryFn == null ||
              ('enabled' in query.options && query.options.enabled === false) ||
              ('suspense' in query.options && query.options.suspense === true) ||
              query.state.status !== 'pending'
            );

          const queries = queryCache.findAll({
            predicate,
          });

          return Promise.all(queries.map((query) => queryClient.prefetchQuery(query.options as FetchQueryOptions)));
        });
      },
    },
  );

  const queryState = dehydrate(queryClient);

  const appState = appStore.getState();

  const scripts = [] satisfies string[];

  const styles = entry.css?.map((file) => `<link rel="stylesheet" crossorigin href="/${file}">`) || [];

  const hydration = [
    `<script>window.__staticQueryClientHydrationData = JSON.parse(${escapeJson(queryState)});</script>`,
    `<script>window.__staticAppStoreHydrationData = JSON.parse(${escapeJson(appState)});</script>`,
  ];

  return {
    router: {
      status: context.router.statusCode,
    },
    root: root
      .replace('<script id="inject-styles"></script>', styles.join(''))
      .replace('<script id="inject-scripts"></script>', scripts.join(''))
      .replace('<script id="inject-hydration"></script>', hydration.join('')),
  };
}
