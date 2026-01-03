import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DEFAULT_LANGUAGE } from '@/helpers/createI18n';
import { LanguageLoaderData } from '@/providers/LanguageProvider';
import { useAppStore } from '@/stores/useAppStore';

import { Document } from './Document';
import { createRoutes } from './routes';

const routes = createRoutes();
const router = createBrowserRouter(routes);

const language = (router.state.loaderData.Language as LanguageLoaderData | undefined)?.language || DEFAULT_LANGUAGE;

const queryState = window.__staticQueryClientHydrationData;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

useAppStore.setState({
  ...window.__staticAppStoreHydrationData,
});

startTransition(() => {
  hydrateRoot(
    document,
    <Document language={language}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={queryState}>
          <RouterProvider router={router} />
        </HydrationBoundary>
      </QueryClientProvider>
    </Document>,
  );
});
