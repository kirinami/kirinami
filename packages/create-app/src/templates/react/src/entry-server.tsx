/* eslint-disable @typescript-eslint/no-throw-literal */

import { Provider } from 'react-redux';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';

import { DEFAULT_LANGUAGE } from '@/helpers/createI18n';
import { createStore } from '@/helpers/createStore';
import { api } from '@/services/api';
import { Head, HeadProvider, headToJson } from '@/utils/react/head';
import { escapeJson, getMarkupFromTree } from '@/utils/react/ssr';

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

  const language = router.state.location.pathname.split('/').filter(Boolean).pop();

  const store = createStore({
    appSlice: {
      language: language?.length === 2 ? language : DEFAULT_LANGUAGE,
    },
  });

  const root = await getMarkupFromTree(
    <Provider store={store}>
      <HeadProvider context={context.head}>
        <StaticRouterProvider context={context.router} router={router} />
      </HeadProvider>
    </Provider>,
    {
      onAfterRender: (renderPromises) => {
        renderPromises.addQueryPromise(api.reducerPath, () =>
          Promise.all(store.dispatch(api.util.getRunningQueriesThunk())),
        );
      },
    },
  );

  const hydration = `<script>window.__staticStoreHydrationData = JSON.parse(${escapeJson(store.getState())});</script>`;

  return {
    router: {
      status: context.router.statusCode,
    },
    head: headToJson(context.head),
    root: root + hydration,
  };
}
