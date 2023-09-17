import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HeadProvider } from '@/utils/react/head';

import { routes } from './entry-app';

const router = createBrowserRouter(routes);

hydrateRoot(
  document.getElementById('root')!,
  <HeadProvider>
    <RouterProvider router={router} />
  </HeadProvider>,
);
