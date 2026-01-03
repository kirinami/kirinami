import { initReactI18next } from 'react-i18next';
import { createInstance, Resource } from 'i18next';

import { translations } from '@/translations';
import { delay } from '@/utils/delay';

export const DEFAULT_LANGUAGE = 'en';

const translationsMemo: Record<string, Resource> = {};

export const getResources = async (language: string) => {
  await delay(translationsMemo[language] ? 100 : 1000);

  translationsMemo[language] ||= {
    [language]: {
      translation: translations[language] || translations[DEFAULT_LANGUAGE],
    },
  };

  return translationsMemo[language];
};

export function createI18n(language: string, resources?: Resource) {
  const i18n = createInstance();

  void i18n.use(initReactI18next).init({
    lng: language,
    fallbackLng: DEFAULT_LANGUAGE,
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
      translation: (typeof translations)[string];
    };
    keySeparator: '.';
    interpolation: {
      escapeValue: false;
    };
    returnNull: false;
  }
}
