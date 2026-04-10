import { Fragment, Suspense, useEffect, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { LoaderFunction, Outlet, useLoaderData, useLocation, useNavigation } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Resource } from 'i18next';

import { LoadingFallback } from '@/components/Fallback/LoadingFallback';
import { createI18n, DEFAULT_LANGUAGE, getResources } from '@/helpers/createI18n';
import { useAppStore } from '@/stores/useAppStore';
import { setLocale as setDayjsLocale } from '@/utils/lib/dayjs';
import { setLocale as setZodLocale } from '@/utils/lib/zod';

export type LanguageLoaderData = {
  language: string;
  resources: Resource;
};

export function languageLoader(): LoaderFunction {
  return async ({ params: { language = DEFAULT_LANGUAGE } }): Promise<LanguageLoaderData> => ({
    language,
    resources: await getResources(language),
  });
}

export function LanguageProvider() {
  const { state } = useNavigation();
  const { key } = useLocation();

  const { language, resources } = useLoaderData<LanguageLoaderData>();

  const queryClient = useQueryClient();

  const i18n = useMemo(() => createI18n(language, resources), [language, resources]);

  setDayjsLocale(i18n.language);
  setZodLocale(i18n.language);

  useEffect(() => {
    const { language } = useAppStore.getState();

    if (i18n.language === language) {
      return;
    }

    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir();

    useAppStore.setState({
      language: i18n.language,
    });

    void queryClient.resetQueries();
  }, [queryClient, i18n]);

  if (state === 'loading') {
    return (
      <Fragment key={key}>
        <title>{i18n.t('common.loading')}</title>
        <LoadingFallback />
      </Fragment>
    );
  }

  return (
    <Suspense key={key} fallback={<LoadingFallback />}>
      <I18nextProvider i18n={i18n}>
        <Outlet />
      </I18nextProvider>
    </Suspense>
  );
}
