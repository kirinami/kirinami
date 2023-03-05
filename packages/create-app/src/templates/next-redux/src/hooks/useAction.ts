import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { AsyncThunk, unwrapResult } from '@reduxjs/toolkit';

import { useRenderPromises } from '@/helpers/getMarkupFromTree';
import { isServer } from '@/utils/ssr';

import { useDispatch } from './useDispatch';

type Thunk<Return, Args> = AsyncThunk<Return, Args, Record<string, unknown>>;

type Options<Args> =
  | { lazy: true; ssr?: false; args?: undefined }
  | ({ lazy?: false; ssr: boolean } & (Args extends void ? { args?: undefined } : { args: Args }));

let isFirstRenderAfterSSR = !isServer;

export function useAction<Return, Args>(thunk: Thunk<Return, Args>, options?: Options<Args>) {
  const router = useRouter();

  const renderPromises = useRenderPromises();

  const dispatch = useDispatch();

  const key = useMemo(
    () => `${thunk.typePrefix}(${options?.args ? JSON.stringify(options.args) : ''})`,
    [thunk.typePrefix, options?.args]
  );

  const [loading, setLoading] = useState(!options?.ssr || options?.lazy ? false : renderPromises.isDone(key));
  const [error, setError] = useState<Error>();

  const action = useCallback(
    async (args: Args) => {
      try {
        setLoading(true);
        return await dispatch(thunk(args)).then(unwrapResult);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(typeof err === 'string' ? err : 'Undefined error occurred');
        setError(error as Error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [thunk, dispatch]
  );

  useEffect(() => {
    const exec = () => {
      if (!options?.lazy) {
        action(options?.args as Args).catch((err) => console.error(err));
      }
    };

    if (isFirstRenderAfterSSR) {
      isFirstRenderAfterSSR = false;

      if (!options?.ssr) {
        exec();
      }
    }

    router.events.on('routeChangeComplete', exec);

    return () => router.events.off('routeChangeComplete', exec);
  }, [options?.ssr, options?.lazy, router, action, key]);

  if (options?.ssr && !options?.lazy) {
    renderPromises.register(key, () => action(options?.args as Args).catch((err) => console.error(err)));
  }

  return useMemo(() => ({ loading, error, action }), [loading, error, action]);
}
