import { useMemo } from 'react';

import { loginAction } from '@/slices/authSlice/actions';

import { useAction } from '../useAction';

export function useLogin() {
  const { loading, error, action: login } = useAction(loginAction, { lazy: true });

  return useMemo(() => ({ loading, error, login }), [error, loading, login]);
}
