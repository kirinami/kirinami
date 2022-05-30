import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';

import todosSlice from '@/stores/todos/todos';

import Todo from '../stores/todos/types/Todo';

let reduxStoreMemo: ReduxStore | undefined;

const isServer = typeof window === 'undefined';

export type ReduxStore = ReturnType<typeof createReduxStore>;

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], string>({
      query: () => '/todos',
    }),
  }),
});

const createReduxStore = (preloadedState?: Record<string, unknown>) => configureStore({
  reducer: {
    [todosSlice.name]: todosSlice.reducer,
    [todosApi.reducerPath]: todosApi.reducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(todosApi.middleware),
  devTools: !isServer && process.env.NODE_ENV === 'development',
});

export default function getReduxStore(initialState?: Record<string, unknown>) {
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
}
