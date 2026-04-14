import { createContext, createElement, ReactNode, useContext } from 'react';
import { createStore, useStore } from 'zustand';

export type AppProps = {
  count: number;
};

export type AppState = AppProps & {
  changeCount: (count: number) => void;
};

export type AppStore = ReturnType<typeof createAppStore>;

export const createAppStore = (initProps?: Partial<AppProps>) =>
  createStore<AppState>((set, get) => ({
    count: 0,

    ...initProps,

    changeCount: (count) => set({ count }),
  }));

const AppStoreContext = createContext<AppStore | null>(null);

export type AppStoreProviderProps = {
  store: AppStore;
  children: ReactNode;
};

export function AppStoreProvider({ store, children }: AppStoreProviderProps) {
  return createElement(AppStoreContext.Provider, { value: store }, children);
}

export function useAppStore(): AppState;
export function useAppStore<T>(selector: (state: AppState) => T): T;
export function useAppStore(selector = (state: AppState) => state) {
  const store = useContext(AppStoreContext);

  if (!store) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }

  return useStore(store, selector);
}
