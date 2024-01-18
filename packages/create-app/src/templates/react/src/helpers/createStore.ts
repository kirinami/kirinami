import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { api } from '@/services/api';
import { appSlice } from '@/slices/app';

function createReducer() {
  return combineSlices(api, appSlice);
}

export function createStore(preloadedState?: Partial<ReturnType<ReturnType<typeof createReducer>>>) {
  const reducer = createReducer();

  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    preloadedState,
  });

  if (!import.meta.env.SSR) {
    setupListeners(store.dispatch);
  }

  return store;
}

export type Store = ReturnType<typeof createStore>;
export type State = ReturnType<Store['getState']>;
export type Dispatch = Store['dispatch'];
