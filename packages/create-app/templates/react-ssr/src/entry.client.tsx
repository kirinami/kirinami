import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';

import { createI18n, DEFAULT_LANGUAGE } from '@/lib/createI18n';
import { createQueryClient } from '@/lib/createQueryClient';
import { AppStoreProvider, createAppStore } from '@/stores/useAppStore';

import { Document } from './Document';
import { createRoutes } from './routes';

const assets = window.__staticAssetsHydrationData;

const routes = createRoutes();
const router = createBrowserRouter(routes);

const language = router.state.matches.at(-1)?.params.language || DEFAULT_LANGUAGE;

const i18n = createI18n(language, window.__staticI18nHydrationData);

const queryState = window.__staticQueryClientHydrationData;

const queryClient = createQueryClient();

const appStore = createAppStore(window.__staticAppStoreHydrationData);

startTransition(() => {
  hydrateRoot(
    document,
    <Document language={language} assets={assets}>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={queryState}>
            <AppStoreProvider store={appStore}>
              <RouterProvider router={router} />
            </AppStoreProvider>
          </HydrationBoundary>
        </QueryClientProvider>
      </I18nextProvider>
    </Document>,
  );
});
