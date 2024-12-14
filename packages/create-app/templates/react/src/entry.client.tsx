/* eslint-disable no-underscore-dangle */

import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppStoreProvider, createAppStore } from '@/stores/useAppStore';
import { HeadProvider } from '@/utils/react/head';
import { requestBrowserIdle } from '@/utils/react/ssr/client';

import { routes } from './main';

async function hydrate() {
  const router = createBrowserRouter(routes);

  const queryState = window.__staticQueryClientHydrationData;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
      },
    },
  });

  const appStore = createAppStore(window.__staticAppStoreHydrationData);

  startTransition(() => {
    hydrateRoot(
      document.getElementById('root')!,
      <HeadProvider>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={queryState}>
            <AppStoreProvider store={appStore}>
              <RouterProvider router={router} />
            </AppStoreProvider>
          </HydrationBoundary>
        </QueryClientProvider>
      </HeadProvider>,
    );
  });
}

requestBrowserIdle(hydrate);
