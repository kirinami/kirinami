/// <reference types="vite/client" />

import { HydrationState } from 'react-router';
import { DehydratedState } from '@tanstack/react-query';

import { AppStoreState } from '@/stores/useAppStore';

declare global {
  interface Window {
    __staticRouterHydrationData: HydrationState | undefined;
    __staticQueryClientHydrationData: DehydratedState | undefined;
    __staticAppStoreHydrationData: AppStoreState | undefined;
  }
}

export type {};
