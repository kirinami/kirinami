import { createContext, createElement, ReactNode, useContext } from 'react';
import { createStore, useStore } from 'zustand';

import { DEFAULT_LANGUAGE } from '@/helpers/createI18n';

export type InitialState<T extends object> = {
  [K in keyof T as T[K] extends () => void ? never : K]?: T[K];
};

export type AppStoreState = {
  language: string;
  fetch: (input: string, init?: RequestInit) => Promise<Response>;
  changeLanguage: (language: string) => void;
};

export const createAppStore = (initialState?: InitialState<AppStoreState>) =>
  createStore<AppStoreState>((set, get) => ({
    auth: undefined,
    language: DEFAULT_LANGUAGE,

    ...initialState,

    fetch: (input, init = {}) => {
      const { language } = get();

      const headers = new Headers(init.headers);

      headers.set('Accept-Language', headers.get('Accept-Language') ?? language);

      return fetch(import.meta.env.VITE_API_URL + input, { ...init, headers });
    },

    changeLanguage: (language: string) => set({ language }),
  }));

type AppStoreContextValue = ReturnType<typeof createAppStore>;

const AppStoreContext = createContext<AppStoreContextValue | null>(null);

export function AppStoreProvider({ store, children }: { store: AppStoreContextValue; children: ReactNode }) {
  return createElement(
    AppStoreContext.Provider,
    {
      value: store,
    },
    children,
  );
}

export function useAppStore(): AppStoreState;
export function useAppStore<T>(selector: (state: AppStoreState) => T): T;
export function useAppStore(selector = (state: AppStoreState) => state) {
  const store = useContext(AppStoreContext);

  if (!store) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }

  return useStore(store, selector);
}
