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

import { DEFAULT_LANGUAGE } from '@/helpers/createI18n';
import { AppStoreProvider, createAppStore } from '@/stores/useAppStore';
import { Head, HeadProvider, headToJson } from '@/utils/react/head';
import { escapeJson, getMarkupFromTree } from '@/utils/react/ssr/server';

import { routes } from './main';

const handler = createStaticHandler(routes);

export async function render(request: Request) {
  const context = {
    head: {} as Head,
    router: await handler.query(request),
  };

  if (context.router instanceof Response) {
    throw context.router;
  }

  const router = createStaticRouter(handler.dataRoutes, context.router);

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
    language: router.state.loaderData.HydrationProvider.state.i18n.language,
  });

  const root = await getMarkupFromTree(
    <HeadProvider context={context.head}>
      <QueryClientProvider client={queryClient}>
        <AppStoreProvider store={appStore}>
          <StaticRouterProvider context={context.router} router={router} />
        </AppStoreProvider>
      </QueryClientProvider>
    </HeadProvider>,
    {
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

  const hydration = `
    <script>window.__staticQueryClientHydrationData = JSON.parse(${escapeJson(queryState)});</script>
    <script>window.__staticAppStoreHydrationData = JSON.parse(${escapeJson(appState)});</script>
  `;

  return {
    router: {
      status: context.router.statusCode,
    },
    head: headToJson(context.head),
    root: root + hydration,
  };
}
