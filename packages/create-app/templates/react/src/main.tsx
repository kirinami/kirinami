import './main.scss';

import { redirect, RouteObject } from 'react-router-dom';

import { DEFAULT_LANGUAGE } from '@/helpers/createI18n';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { hydrationLoader, HydrationProvider } from '@/providers/HydrationProvider';

export const routes: RouteObject[] = [
  {
    id: 'HydrationProvider',
    path: ':language',
    loader: hydrationLoader,
    element: <HydrationProvider />,
    children: [
      {
        id: 'HomePage',
        index: true,
        element: <HomePage />,
      },
      {
        id: 'NotFoundPage',
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
    id: 'LanguageRedirect',
    path: '*',
    loader: () => redirect(DEFAULT_LANGUAGE),
  },
];
