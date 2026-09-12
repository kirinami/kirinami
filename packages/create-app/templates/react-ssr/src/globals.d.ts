/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { HydrationState } from 'react-router';
import type { DehydratedState } from '@tanstack/react-query';
import type { Resource } from 'i18next';

import type { AppState } from '@/stores/useAppStore';

declare global {
  interface Window {
    __staticAssetsHydrationData: {
      fonts?: string[];
      styles: string[];
      modules: string[];
    };
    __staticRouterHydrationData: HydrationState;
    __staticI18nHydrationData: Resource;
    __staticQueryClientHydrationData: DehydratedState;
    __staticAppStoreHydrationData: AppState;
  }

  interface ImportMetaEnv {
    readonly VITE_BASE_URL: string;
    readonly VITE_API_URL: string;
  }
}
