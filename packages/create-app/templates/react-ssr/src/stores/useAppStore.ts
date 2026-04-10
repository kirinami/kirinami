import { create } from 'zustand/react';

import { DEFAULT_LANGUAGE } from '@/helpers/createI18n';
import { Fetcher, fetcher } from '@/utils/fetcher';

export type AppStoreState = {
  language: string;
};

export type AppStoreActions = {
  fetcher: Fetcher;
};

export type AppStore = AppStoreState & AppStoreActions;

export const useAppStore = create<AppStore>()((set, get) => ({
  language: DEFAULT_LANGUAGE,

  fetcher: (input, init) => {
    const { language } = get();

    const headers = new Headers(init?.headers);
    headers.set('Accept-Language', headers.get('Accept-Language') ?? language);

    const url = new URL(input, import.meta.env.VITE_API_URL);

    return fetcher(url, { ...init, headers });
  },
}));
