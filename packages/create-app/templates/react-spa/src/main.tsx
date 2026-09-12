import './main.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { routes } from '@/routes.ts';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

const router = createBrowserRouter(routes);

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />,
  </StrictMode>,
);
