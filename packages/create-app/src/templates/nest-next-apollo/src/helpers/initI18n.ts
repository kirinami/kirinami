import { initReactI18next } from 'react-i18next';
import { NextPageContext } from 'next';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { createInstance } from 'i18next';

import { GetTranslationsDocument, GetTranslationsQuery, GetTranslationsQueryVariables } from '@/graphql/client';

import getLocaleFromContext from './getLocaleFromContext';

type I18N = ReturnType<typeof createInstance>;

const i18n = createInstance().use(initReactI18next) as I18N & {
  changeLanguageBase: I18N['changeLanguage'];
  extract: () => Record<string, string>;
};

export async function loadTranslation(apolloClient: ApolloClient<NormalizedCacheObject>, locale: string) {
  const { data } = await apolloClient.query<GetTranslationsQuery, GetTranslationsQueryVariables>({
    query: GetTranslationsDocument,
    variables: {
      locale,
    },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  });

  return data.getTranslations.reduce(
    (translations, { key, value }) => ({
      ...translations,
      [key]: value,
    }),
    {}
  );
}

export default function initI18n(ctx: NextPageContext | null, translation?: Record<string, string>) {
  const locale = getLocaleFromContext(ctx);

  if (!i18n.isInitialized) {
    i18n.init({
      lng: locale,
      fallbackLng: 'uk',
      interpolation: {
        escapeValue: false,
      },
    });

    i18n.changeLanguageBase = i18n.changeLanguage;

    i18n.changeLanguage = async (language: string) => {
      document.cookie = `accept-language=${language}; path=/`;
      window.location.reload();

      return i18n.t;
    };
  }

  if (translation) {
    i18n.addResourceBundle(locale, 'translation', translation, true, true);
    i18n.changeLanguageBase(locale);
  }

  i18n.extract = () => translation || {};

  return i18n as typeof i18n & {
    extract: () => typeof translation;
  };
}
