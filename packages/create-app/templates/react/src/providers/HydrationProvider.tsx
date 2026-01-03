import { Suspense, useEffect, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Await, LoaderFunction, Outlet, useAsyncValue, useLoaderData } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Resource } from 'i18next';
import { useShallow } from 'zustand/react/shallow';

import { ErrorBoundaryFallback } from '@/components/Fallback/ErrorBoundaryFallback';
import { LoadingFallback } from '@/components/Fallback/LoadingFallback';
import { createI18n, DEFAULT_LANGUAGE, getResources } from '@/helpers/createI18n';
import { useAppStore } from '@/stores/useAppStore';
import { setLocale as setDayjsLocale } from '@/utils/dayjs';
import { setLocale as setZodLocale } from '@/utils/zod';

export type HydrationLoaderState = {
  i18n: {
    language: string;
    resources: Resource;
  };
};

export type HydrationLoaderData = {
  key: string;
  state: HydrationLoaderState | Promise<HydrationLoaderState>;
};

export const hydrationLoader: LoaderFunction = async ({
  request,
  params: { language = DEFAULT_LANGUAGE },
}): Promise<HydrationLoaderData> => {
  // Wrap in Promise to avoid blocking on SSR
  // eslint-disable-next-line no-async-promise-executor,@typescript-eslint/no-misused-promises
  const state = new Promise<HydrationLoaderState>(async (resolve) => {
    resolve({
      i18n: {
        language,
        resources: await getResources(language),
      },
    });
  });

  return {
    key: btoa(request.url),
    state: import.meta.env.SSR ? await state : state,
  };
};

export function HydrationOutlet() {
  const state = useAsyncValue() as HydrationLoaderState;

  const queryClient = useQueryClient();

  const i18n = useMemo(() => createI18n(state.i18n.language, state.i18n.resources), [state.i18n]);

  const appState = useAppStore(useShallow(({ changeLanguage }) => ({ changeLanguage })));

  useEffect(() => {
    if (document.documentElement.lang === i18n.language) {
      return;
    }

    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);

    appState.changeLanguage(i18n.language);

    void queryClient.resetQueries();
  }, [queryClient, i18n, appState]);

  setDayjsLocale(i18n.language);
  setZodLocale(i18n.language);

  return (
    <I18nextProvider i18n={i18n}>
      <Outlet />
    </I18nextProvider>
  );
}

export function HydrationProvider() {
  const { key, state } = useLoaderData<HydrationLoaderData>();

  return (
    <>
      <title>...</title>
      <Suspense key={key} fallback={<LoadingFallback />}>
        <Await resolve={state} errorElement={<ErrorBoundaryFallback />}>
          <HydrationOutlet />
        </Await>
      </Suspense>
    </>
  );
}
