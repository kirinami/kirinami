/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { HydrationState } from 'react-router';
import { DehydratedState } from '@tanstack/react-query';

import { AppStoreState } from '@/stores/useAppStore';

declare global {
  interface Window {
    __staticAssetsHydrationData: { style: string; entry: string };
    __staticRouterHydrationData: HydrationState;
    __staticQueryClientHydrationData: DehydratedState;
    __staticAppStoreHydrationData: AppStoreState;
  }

  interface ImportMetaEnv {
    readonly VITE_BASE_URL: string;
    readonly VITE_API_URL: string;
  }
}

export type {};
