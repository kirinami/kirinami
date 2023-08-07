import { HelmetProvider, HelmetServerState } from 'react-helmet-async';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';

import { getMarkupFromTree } from './utils/react/ssr';
import { routes } from './entry';

const handler = createStaticHandler(routes);

export async function render(request: Request) {
  const context = {
    helmet: {} as HelmetServerState,
    router: await handler.query(request),
  };

  if (context.router instanceof Response) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw context;
  }

  const router = createStaticRouter(handler.dataRoutes, context.router);

  const html = await getMarkupFromTree({
    tree: (
      <HelmetProvider context={context}>
        <StaticRouterProvider context={context.router} router={router} />
      </HelmetProvider>
    ),
  });

  return {
    helmet: context.helmet,
    router: context.router,
    html,
  };
}
