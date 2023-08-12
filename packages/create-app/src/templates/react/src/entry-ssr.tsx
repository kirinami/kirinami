import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';

import { routes } from '@/entry';
import { Head, HeadProvider, headToJson } from '@/utils/react/head';
import { getMarkupFromTree } from '@/utils/react/ssr';

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

  const root = await getMarkupFromTree(
    <HeadProvider context={context.head}>
      <StaticRouterProvider context={context.router} router={router} />
    </HeadProvider>,
  );

  return {
    router: {
      status: context.router.statusCode,
    },
    head: headToJson(context.head),
    root,
  };
}
