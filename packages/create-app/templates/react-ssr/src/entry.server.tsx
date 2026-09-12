import { ReactNode } from 'react';
import { renderToReadableStream } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { dehydrate, FetchQueryOptions, QueryClientProvider } from '@tanstack/react-query';

import { createI18n, DEFAULT_LANGUAGE, getResources } from '@/lib/createI18n';
import { createQueryClient } from '@/lib/createQueryClient';
import { escapeJson, prefetchRender } from '@/lib/react/server';
import { AppStoreProvider, createAppStore } from '@/stores/useAppStore';

import { Document } from './Document';
import { createRoutes } from './routes';

export async function handler(assets: { fonts: string[]; styles?: string[]; modules: string[] }, request: Request) {
  const routes = createRoutes();
  const handler = createStaticHandler(routes);

  const context = await handler.query(request);

  if (context instanceof Response) {
    return context;
  }

  const router = createStaticRouter(handler.dataRoutes, context);

  const language = router.state.matches.at(-1)?.params.language || DEFAULT_LANGUAGE;

  const i18n = createI18n(language, await getResources(language));

  const queryClient = createQueryClient();

  const appStore = createAppStore();

  const children = (
    <Document language={language} assets={assets}>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <AppStoreProvider store={appStore}>
            <StaticRouterProvider context={context} router={router} />
          </AppStoreProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </Document>
  );

  const render = async (children: ReactNode) => {
    const i18nState = i18n.store.data;

    const queryState = dehydrate(queryClient);

    const appState = appStore.getState();

    const stream = await renderToReadableStream(children, {
      bootstrapScriptContent: `
          window.__staticAssetsHydrationData = JSON.parse(${escapeJson(assets)});
          window.__staticI18nHydrationData = JSON.parse(${escapeJson(i18nState)});
          window.__staticQueryClientHydrationData = JSON.parse(${escapeJson(queryState)});
          window.__staticAppStoreHydrationData = JSON.parse(${escapeJson(appState)});
        `,
      bootstrapModules: assets.modules,
      onError: (error) => console.error('onError:', error),
    });

    await stream.allReady;

    return stream;
  };

  const stream = await prefetchRender(children, render, {
    onCollect: async (renderPromises) => {
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) =>
            !(
              query.meta?.ssr === false ||
              query.options.queryKey == null ||
              query.options.queryFn == null ||
              ('enabled' in query.options && query.options.enabled === false) ||
              ('suspense' in query.options && query.options.suspense === true) ||
              query.state.status !== 'pending'
            ),
        })
        .forEach((query) =>
          renderPromises.addPromise(query.queryHash, () =>
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
