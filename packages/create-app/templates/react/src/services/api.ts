import { buildCreateApi, coreModule, fetchBaseQuery, reactHooksModule } from '@reduxjs/toolkit/query/react';

import { State } from '@/helpers/createStore';
import { fetch } from '@/utils/http';

export const api = buildCreateApi(
  coreModule(),
  reactHooksModule({
    unstable__sideEffectsInRender: import.meta.env.SSR,
  }),
)({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    fetchFn: fetch,
    prepareHeaders: async (headers, api) => {
      const state = api.getState() as State;

      headers.set('Accept-Language', state.appSlice.language);

      return headers;
    },
  }),
  endpoints: () => ({}),
});
