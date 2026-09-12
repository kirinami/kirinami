import type { RouteObject } from 'react-router';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HydrateFallback } from '@/components/HydrateFallback';

export const routes = [
  {
    path: '/',
    ErrorBoundary,
    HydrateFallback,
    lazy: () => import('@/pages/HomePage').then((module) => ({ Component: module.HomePage })),
  },
] satisfies RouteObject[];
