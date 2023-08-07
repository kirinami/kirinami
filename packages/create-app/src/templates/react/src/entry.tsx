import './entry.scss';

import { RouteObject } from 'react-router-dom';

import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

export const routes: RouteObject[] = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: '*',
    loader: () =>
      new Response('Not Found', {
        status: 404,
      }),
    element: <NotFoundPage />,
  },
];
