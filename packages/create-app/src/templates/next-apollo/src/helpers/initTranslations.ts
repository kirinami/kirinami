import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NextPageContext } from 'next';

import en from '@/assets/locales/en/translation.json';
import uk from '@/assets/locales/uk/translation.json';

import { parseCookie } from '../utils/cookie';

const i18n = createInstance()
  .use(initReactI18next);

export default function initTranslations(ctx?: NextPageContext | null) {
  const cookies = parseCookie(typeof window === 'undefined' ? ctx?.req?.headers?.cookie || '' : document.cookie);
  const language = cookies['accept-language'] || 'en';

  if (i18n.isInitialized) {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }

    return i18n;
  }

  i18n.init({
    lng: language,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: en,
      },
      uk: {
        translation: uk,
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  i18n.toJSON = () => undefined;

  return i18n;
}
