import { initReactI18next } from 'react-i18next';
import { NextPageContext } from 'next';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { createInstance } from 'i18next';

import { GetTranslationsDocument, GetTranslationsQuery, GetTranslationsQueryVariables } from '@/graphql/client';
import { isServer } from '@/utils/ssr';

import { getLanguageFromContext } from './getLanguageFromContext';

let i18nMemo: ReturnType<typeof createI18n> | undefined;

export async function loadTranslation(apolloClient: ApolloClient<NormalizedCacheObject>, language: string) {
  const { data } = await apolloClient.query<GetTranslationsQuery, GetTranslationsQueryVariables>({
    query: GetTranslationsDocument,
    variables: {
      language,
    },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  });

  return data.getTranslations.reduce<Record<string, string>>(
    (translations, { key, value }) => ({
      ...translations,
      [key]: value,
    }),
    {}
  );
}

function createI18n(language: string, translation: Record<string, string> | undefined) {
  type I18N = ReturnType<typeof createInstance>;

  const i18n = createInstance().use(initReactI18next) as I18N & {
    extract: () => Record<string, string>;
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

  i18n.extract = () => translation || {};

  return i18n;
}

export function initI18n(ctx: NextPageContext | null, initialTranslation?: Record<string, string>) {
  const language = getLanguageFromContext(ctx);

  const i18n = i18nMemo || createI18n(language, initialTranslation || {});

  if (isServer) {
    return i18n;
  }

  if (!i18nMemo) {
    i18nMemo = i18n;
  }

  return i18n;
}

//

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}
