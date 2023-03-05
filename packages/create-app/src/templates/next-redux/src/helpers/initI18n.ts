import { initReactI18next } from 'react-i18next';
import { NextPageContext } from 'next';
import { createInstance } from 'i18next';

import { ApiClient } from '@/api/client';
import { isServer } from '@/utils/ssr';

import { getLanguageFromContext } from './getLanguageFromContext';

let i18nMemo: ReturnType<typeof createI18n> | undefined;

export async function loadTranslation(apiClient: ApiClient<unknown>, language: string) {
  const translations = await apiClient.translations.getTranslations(language);

  return translations.reduce<Record<string, string>>(
    (translations, { key, value }) => ({
      ...translations,
      [key]: value,
    }),
    {}
  );
}

function createI18n(ctx: NextPageContext | null, translation: Record<string, string> | undefined) {
  const language = getLanguageFromContext(ctx);

  const i18n = createInstance().use(initReactI18next) as ReturnType<typeof createInstance> & {
    getState: () => Record<string, string>;
  };

  i18n.init({
    lng: language,
    fallbackLng: 'uk',
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
    resources: {
      [language]: {
        translation: translation || {},
      },
    },
  });

  i18n.changeLanguage = async (language: string) => {
    if (isServer) {
      return i18n.t;
    }

    document.cookie = `accept-language=${language}; path=/`;
    window.location.reload();

    return i18n.t;
  };

  i18n.getState = () => translation || {};

  return i18n;
}

export function initI18n(ctx: NextPageContext | null, initialTranslation?: Record<string, string>) {
  const i18n = i18nMemo ?? createI18n(ctx, initialTranslation || {});

  if (!i18nMemo) {
    if (!isServer) {
      i18nMemo = i18n;
    }
  }

  return i18n;
}

// /

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}
