import { useCallback, useState } from 'react';
import { AsyncThunk, unwrapResult } from '@reduxjs/toolkit';

import useDispatch from './useDispatch';

export type Key = number | string;

export type State = Record<string, {
  loading: boolean,
  errors: string[]
}>;

export type Run<Req, Res> = (req: Req, key?: Key) => Promise<Res>;

export type Read = {
  (prop: 'loading', key?: Key): boolean,
  (prop: 'errors', key?: Key): string[],
};

export type Reset = () => void;

export type Action<Req, Res> = AsyncThunk<Res, Req, Record<Key, unknown>>;

export type Config = {
  dispatchLoading?: boolean,
  dispatchErrors?: boolean,
};

export type Return<Req, Res> = [Run<Req, Res>, Read, Reset];

export default function useAction<Req, Res>(action: Action<Req, Res>, config?: Config): Return<Req, Res> {
  const dispatchLoading = config?.dispatchLoading ?? true;
  const dispatchErrors = config?.dispatchErrors ?? true;

  const [state, setState] = useState<State>({
    undefined: {
      loading: false,
      errors: [],
    },
  });

  const dispatch = useDispatch();

  const run = useCallback<Run<Req, Res>>(async (req, key) => {
    try {
      if (dispatchLoading) {
        setState(state => ({
          ...state,
          [String(key)]: {
            loading: true,
            errors: [],
          },
        }));
      }

      const res = await dispatch(action(req))
        .then(unwrapResult);

      if (dispatchLoading) {
        setState(state => ({
          ...state,
          [String(key)]: {
            loading: false,
            errors: [],
          },
        }));
      }

      return res;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Undefined error occurred';

      if (dispatchErrors) {
        setState(state => ({
          ...state,
          [String(key)]: {
            loading: false,
            errors: [error],
          },
        }));
      }

      throw err;
    }
  }, [action, dispatchLoading, dispatchErrors, dispatch]);

  const read = useCallback<Read>((prop, key) => {
    let result;
    if (key) {
      result = (state[String(key)] || state.undefined)[prop];
    } else if (prop === 'loading') {
      result = Object.entries(state)
        .some(([, status]) => status.loading);
    } else if (prop === 'errors') {
      result = Object.entries(state)
        .reduce<string[]>((errors, [, status]) => [...errors, ...status.errors], []);
    }
    return result as boolean & string[];
  }, [state]);

  const reset = useCallback<Reset>(() => {
    setState({
      undefined: {
        loading: false,
        errors: [],
      },
    });
  }, []);

  return [run, read, reset];
}
