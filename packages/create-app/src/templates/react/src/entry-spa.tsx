import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from '@/entry';
import { HeadProvider } from '@/utils/react/head';

export async function render() {
  const router = createBrowserRouter(routes);

  hydrateRoot(
    document.getElementById('root')!,
    <HeadProvider>
      <RouterProvider router={router} />
    </HeadProvider>,
  );
}

render().catch(console.error);
