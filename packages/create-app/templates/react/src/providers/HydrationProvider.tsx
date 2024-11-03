import { Suspense, useEffect, useMemo, useRef } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Await, defer, LoaderFunction, Outlet, useAsyncValue, useLoaderData } from 'react-router-dom';
import { Resource } from 'i18next';

import { ErrorBoundaryFallback } from '@/containers/Fallback/ErrorBoundaryFallback';
import { LoadingFallback } from '@/containers/Fallback/LoadingFallback';
import { createI18n, DEFAULT_LANGUAGE, getResources } from '@/helpers/createI18n';
import { useDispatch } from '@/hooks/useDispatch';
import { api } from '@/services/api';
import { setLanguage } from '@/slices/app';
import { useHead } from '@/utils/react/head';

export type HydrationLoaderState = {
  i18n: {
    language: string;
    resources: Resource;
  };
};

export type HydrationLoaderData = {
  state: HydrationLoaderState | Promise<HydrationLoaderState>;
};

export const hydrationLoader: LoaderFunction = async ({ params: { language = DEFAULT_LANGUAGE } }) => {
  const state: Promise<HydrationLoaderState> = new Promise(async (resolve) => {
    resolve({
      i18n: {
        language,
        resources: await getResources(language),
      },
    });
  });

  const data: HydrationLoaderData = {
    state: import.meta.env.SSR ? await state : state,
  };

  return defer(data);
};

export function HydrationOutlet() {
  const dispatch = useDispatch();

  const state = useAsyncValue() as HydrationLoaderState;

  const i18n = useMemo(() => createI18n(state.i18n.language, state.i18n.resources), [state.i18n.language]);

  const isFirstRef = useRef(true);

  useHead({
    language: {
      locale: i18n.language,
      dir: i18n.dir(i18n.language),
    },
    title: i18n.t('loading'),
  });

  useEffect(() => {
    if (isFirstRef.current) {
      isFirstRef.current = false;

      return;
    }

    dispatch(setLanguage(state.i18n.language));
    dispatch(api.util.resetApiState());
  }, [dispatch, state.i18n.language]);

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
