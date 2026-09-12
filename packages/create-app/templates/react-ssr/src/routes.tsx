import './globals.css';

import { lazy } from 'react';
import { redirect, RouteObject } from 'react-router';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/components/Layout';
import { DEFAULT_LANGUAGE } from '@/lib/i18n';

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

export function createRoutes(): RouteObject[] {
  return [
    {
      path: ':language',
      element: <Layout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: '*',
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
