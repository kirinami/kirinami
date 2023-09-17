import { initReactI18next } from 'react-i18next';
import { createInstance, Resource } from 'i18next';

import { endpoints } from '@/fixtures/endpoints';
import { TranslationType } from '@/types/api';
import { fetch } from '@/utils/http';

export const DEFAULT_LANGUAGE = 'en';

const translationsMemo: Record<string, Resource> = {};

export const getResources = async (language: string) => {
  translationsMemo[language] =
    translationsMemo[language] ||
    fetch(`${import.meta.env.VITE_API_URL}/translations/${language}`, {}, endpoints)
      .then((response) => response.json())
      .then((translations: TranslationType[]) => ({
        [language]: {
          translation: Object.fromEntries(translations.map(({ key, value }) => [key, value])),
        },
      }));

  return translationsMemo[language];
};

export function createI18n(language: string, resources?: Resource) {
  const i18n = createInstance();

  i18n.use(initReactI18next);

  i18n.init({
    lng: language,
    fallbackLng: DEFAULT_LANGUAGE,
    resources,
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });

  return i18n;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}
