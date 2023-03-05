import { NextPageContext } from 'next';

import { ApiClient } from '@/api/client';
import { parseCookie } from '@/utils/cookie';
import { isServer } from '@/utils/ssr';

let apiClientMemo: ReturnType<typeof createApiClient> | undefined;

function createApiClient(ctx?: NextPageContext | null) {
  const cookies = parseCookie(isServer ? ctx?.req?.headers?.cookie || '' : document.cookie);

  return new ApiClient({
    baseUrl: 'http://127.0.0.1:3000',
    baseApiParams: {
      headers: {
        Authorization: cookies['access-token'] ? `Bearer ${cookies['access-token']}` : '',
      },
    },
  });
}

export function initApiClient(ctx?: NextPageContext | null) {
  const apiClient = apiClientMemo ?? createApiClient(ctx);

  if (!apiClientMemo) {
    if (!isServer) {
      apiClientMemo = apiClient;
    }
  }

  return apiClient;
}
