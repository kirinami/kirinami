import { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Await, defer, LoaderFunction, Outlet, useAsyncValue, useLoaderData } from 'react-router-dom';
import { Resource } from 'i18next';

import { ErrorBoundary } from '@/components/fallback/ErrorBoundary';
import { Loading } from '@/components/fallback/Loading';
import { createI18n, DEFAULT_LANGUAGE, getResources } from '@/helpers/createI18n';
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
  const state = useAsyncValue() as HydrationLoaderState;

  const i18n = createI18n(state.i18n.language, state.i18n.resources);

  useHead({
    language: {
      locale: i18n.language,
      dir: i18n.dir(i18n.language),
    },
  });

  return (
    <I18nextProvider i18n={i18n}>
      <Outlet />
    </I18nextProvider>
  );
}

export function HydrationProvider() {
  const { state } = useLoaderData() as HydrationLoaderData;

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={state} errorElement={<ErrorBoundary />}>
        <HydrationOutlet />
      </Await>
    </Suspense>
  );
}
