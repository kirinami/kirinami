import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import {
  dehydrate,
  FetchQueryOptions,
  Query,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { DEFAULT_LANGUAGE } from '@/helpers/createI18n';
import { LanguageLoaderData } from '@/providers/LanguageProvider';
import { useAppStore } from '@/stores/useAppStore';
import { escapeJson, getMarkupFromTree } from '@/utils/lib/react/ssr/server';

import { Document } from './Document';
import { createRoutes } from './routes';

export async function render(request: Request) {
  const routes = createRoutes();
  const handler = createStaticHandler(routes);

  const context = await handler.query(request);

  if (context instanceof Response) {
    return context;
  }

  const router = createStaticRouter(handler.dataRoutes, context);

  const language = (router.state.loaderData.Language as LanguageLoaderData | undefined)?.language || DEFAULT_LANGUAGE;

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

  const tree = (
    <Document language={language}>
      <QueryClientProvider client={queryClient}>
        <StaticRouterProvider context={context} router={router} />
      </QueryClientProvider>
    </Document>
  );

  const { error, html } = await getMarkupFromTree(tree, {
    onAfterRender: async (renderPromises) => {
      const predicate = (query: Query) =>
        !(
          query.meta?.ssr === false ||
          query.options.queryFn == null ||
          ('enabled' in query.options && query.options.enabled === false) ||
          ('suspense' in query.options && query.options.suspense === true) ||
          query.state.status !== 'pending'
        );

      queryCache
        .findAll({
          predicate,
        })
        .forEach((query) =>
          renderPromises.addQueryPromise(query.queryHash, () =>
            queryClient.prefetchQuery(query.options as FetchQueryOptions),
          ),
        );
    },
  });

  const queryState = dehydrate(queryClient);

  const appState = useAppStore.getState();

  const hydration = [
    `<script>window.__staticQueryClientHydrationData = JSON.parse(${escapeJson(queryState)});</script>`,
    `<script>window.__staticAppStoreHydrationData = JSON.parse(${escapeJson(appState)});</script>`,
  ]
    .flat()
    .filter((value) => !!value)
    .join('');

  return {
    statusCode: error ? 500 : context.statusCode,
    html: html.replace('</body>', `${hydration}</body>`),
  };
}
