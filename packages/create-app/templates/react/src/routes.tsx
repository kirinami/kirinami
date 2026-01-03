import './globals.css';

import { redirect, RouteObject } from 'react-router';

import { DEFAULT_LANGUAGE } from '@/helpers/createI18n';
import { languageLoader, LanguageProvider } from '@/providers/LanguageProvider';
import { dynamic } from '@/utils/lib/react/lazy';

const HomePage = dynamic(() => import('@/pages/HomePage').then((m) => m.HomePage));
const NotFoundPage = dynamic(() => import('@/pages/NotFoundPage').then((m) => m.NotFoundPage));

export function createRoutes(): RouteObject[] {
  return [
    {
      id: 'Language',
      path: ':language',
      loader: languageLoader(),
      element: <LanguageProvider />,
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
}
