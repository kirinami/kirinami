import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DEFAULT_LANGUAGE } from '@/helpers/createI18n';
import { AppStoreProvider, createAppStore } from '@/stores/useAppStore';
import { requestBrowserIdle } from '@/utils/react/ssr/client';

import { Document } from './Document';
import { routes } from './main';

async function hydrate() {
  const router = createBrowserRouter(routes);
  const language = router.state.loaderData.HydrationProvider?.state.i18n.language || DEFAULT_LANGUAGE;

  console.log(language);

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
      document,
      <Document language={language}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={queryState}>
            <AppStoreProvider store={appStore}>
              <RouterProvider router={router} />
            </AppStoreProvider>
          </HydrationBoundary>
        </QueryClientProvider>
      </Document>,
    );
  });
}

requestBrowserIdle(hydrate);
