/// <reference types="vite/client" />

declare global {
  interface Window {
    __staticQueryClientHydrationData: Record<string, unknown> | undefined;
    __staticAppStoreHydrationData: Record<string, unknown> | undefined;
    __staticRouterHydrationData: Record<string, unknown> | undefined;
  }
}

export type {};
