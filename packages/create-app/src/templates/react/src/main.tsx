import './main.scss';

import { redirect, RouteObject } from 'react-router-dom';

import { DEFAULT_LANGUAGE } from '@/helpers/createI18n';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { hydrationLoader, HydrationProvider } from '@/providers/HydrationProvider';

export const routes: RouteObject[] = [
  {
    path: ':language',
    loader: hydrationLoader,
    element: <HydrationProvider />,
    children: [
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
    ],
  },
  {
    path: '*',
    loader: () => redirect(DEFAULT_LANGUAGE),
  },
];
