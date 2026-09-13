import { initReactI18next } from 'react-i18next';
import { createInstance, Resource } from 'i18next';

import { translations } from '@/translations';

export const DEFAULT_LANGUAGE = 'en';

export async function getResources(language: string): Promise<Resource> {
  const translation = translations[language] || translations[DEFAULT_LANGUAGE];

  return {
    [language]: {
      translation: await translation(),
    },
  };
}

export async function createI18n(language: string, resources: Resource) {
  const i18n = createInstance();

  await i18n.use(initReactI18next).init({
    lng: language,
    resources,
    react: {
      useSuspense: true,
    },
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });

  return i18n;
}

declare module 'i18next' {
  /* eslint-disable @typescript-eslint/consistent-type-definitions */

  interface CustomTypeOptions {
    resources: {
      translation: Awaited<ReturnType<(typeof translations)[string]>>;
    };
    keySeparator: '.';
    interpolation: {
      escapeValue: false;
    };
    returnNull: false;
  }
}
