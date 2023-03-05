import { NextPageContext } from 'next';
import { configureStore } from '@reduxjs/toolkit';

import type { State } from '@/helpers/selectState';
import { authSlice } from '@/slices/authSlice';
import { isServer } from '@/utils/ssr';

export type Store = ReturnType<typeof createStore>;

let storeMemo: Store | null = null;

function createStore<T extends Record<string, unknown>>(preloadedState?: T) {
  return configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
    },
    preloadedState,
  });
}

export function initStore(ctx?: NextPageContext | null, initialState?: State) {
  const store = storeMemo ?? createStore(initialState);

  if (!storeMemo) {
    if (!isServer) {
      storeMemo = store;
    }
  }

  return store;
}
