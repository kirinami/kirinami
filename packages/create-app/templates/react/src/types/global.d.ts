/// <reference types="vite/client" />

declare global {
  interface Window {
    __staticRouterHydrationData: Record<string, unknown> | undefined;
    __staticStoreHydrationData: Record<string, unknown> | undefined;
  }
}

export type {};
