import { Suspense, useEffect, useMemo, useRef } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Await, LoaderFunction, Outlet, useAsyncValue, useLoaderData } from 'react-router-dom';
import { Resource } from 'i18next';
import { useQueryClient } from '@tanstack/react-query';

import { ErrorBoundaryFallback } from '@/containers/Fallback/ErrorBoundaryFallback';
import { LoadingFallback } from '@/containers/Fallback/LoadingFallback';
import { createI18n, DEFAULT_LANGUAGE, getResources } from '@/helpers/createI18n';
import { useAppStore } from '@/stores/useAppStore';
import { useHead } from '@/utils/react/head';
import { day } from '@/utils/day';

export type HydrationLoaderState = {
  i18n: {
    language: string;
    resources: Resource;
  };
};

export type HydrationLoaderData = {
  state: HydrationLoaderState | Promise<HydrationLoaderState>;
};

export const hydrationLoader: LoaderFunction = async ({ params: { language = DEFAULT_LANGUAGE } }): Promise<HydrationLoaderData> => {
  const state = new Promise<HydrationLoaderState>(async (resolve) => {
    setTimeout(async () => {
      resolve({
        i18n: {
          language,
          resources: await getResources(language),
        },
      });
    }, 1000);
  });

  return {
    state: import.meta.env.SSR ? await state : state,
  };
};

export function HydrationOutlet() {
  const state = useAsyncValue() as HydrationLoaderState;

  const i18n = useMemo(() => createI18n(state.i18n.language, state.i18n.resources), [state.i18n.language]);

  const isFirstMountRef = useRef(true);

  const queryClient = useQueryClient();

  const changeLanguage = useAppStore((state) => state.changeLanguage);

  day.locale(i18n.language);

  // useHead({
  //   language: {
  //     locale: i18n.language,
  //     dir: i18n.dir(i18n.language),
  //   },
  //   title: i18n.t('loading'),
  // });

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;

      return;
    }

    changeLanguage(i18n.language);

    queryClient.resetQueries();
  }, [i18n.language, changeLanguage]);

  return (
    <I18nextProvider i18n={i18n}>
      <Outlet />
    </I18nextProvider>
  );
}

export function HydrationProvider() {
  const { state } = useLoaderData() as HydrationLoaderData;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Await resolve={state} errorElement={<ErrorBoundaryFallback />}>
        <HydrationOutlet />
      </Await>
    </Suspense>
  );
}
