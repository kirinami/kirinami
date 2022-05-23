import { configureStore } from '@reduxjs/toolkit';

import todosSlice from '@/stores/todos/todos';

export type ReduxStore = ReturnType<typeof createReduxStore>;

export let reduxStoreMemo: ReduxStore | undefined;

export const isServer = typeof window === 'undefined';

export const createReduxStore = (preloadedState?: Record<string, unknown>) => configureStore({
  reducer: {
    [todosSlice.name]: todosSlice.reducer,
  },
  preloadedState,
  devTools: !isServer && process.env.NODE_ENV === 'development',
});

export const initReduxStore = (initialState?: Record<string, unknown>) => {
  let reduxStore = reduxStoreMemo ?? createReduxStore(initialState);

  if (initialState && reduxStoreMemo) {
    reduxStore = createReduxStore({
      ...reduxStoreMemo.getState(),
      ...initialState,
    });
    reduxStoreMemo = undefined;
  }

  if (isServer) {
    return reduxStore;
  }

  if (!reduxStoreMemo) {
    reduxStoreMemo = reduxStore;
  }

  return reduxStore;
};

export default initReduxStore;
