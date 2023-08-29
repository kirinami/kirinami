import { initReactI18next } from 'react-i18next';
import { createInstance, Resource } from 'i18next';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';

import { endpoints } from '@/fixtures/endpoints';
import { TranslationType } from '@/types/api';
import { fetch } from '@/utils/http';

export const DEFAULT_LANGUAGE = 'en';

export function createI18n(language: string, resources?: Resource) {
  const i18n = createInstance();

  i18n.use(HttpBackend);
  i18n.use(initReactI18next);

  i18n.init<HttpBackendOptions>({
    backend: {
      loadPath: '{{lng}}',
      request: (options, language, payload, done) => {
        fetch(`${import.meta.env.VITE_API_URL}/translations/${language}`, {}, endpoints)
          .then((response) => response.json())
          .then((data: TranslationType[]) =>
            done(null, {
              status: 200,
              data: Object.fromEntries(data.map(({ key, value }) => [key, value])),
            }),
          )
          .catch((err) =>
            done(err, {
              status: 404,
              data: {},
            }),
          );
      },
    },
    lng: language,
    fallbackLng: DEFAULT_LANGUAGE,
    resources,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
    compatibilityJSON: 'v3',
  });

  return i18n;
}

export async function waitI18n(i18n: ReturnType<typeof createI18n>) {
  return new Promise<typeof i18n>((resolve) => {
    const initializedHandler = () => {
      i18n.off('initialized', initializedHandler);

      resolve(i18n);
    };

    if (i18n.isInitialized) {
      initializedHandler();
    } else {
      i18n.on('initialized', initializedHandler);
    }
  });
}

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}
