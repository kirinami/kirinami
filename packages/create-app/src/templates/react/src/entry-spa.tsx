import { hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './entry';

const root = document.getElementById('root')!;

const router = createBrowserRouter(routes);

hydrateRoot(
  root,
  <HelmetProvider>
    <RouterProvider router={router} />
  </HelmetProvider>,
);
