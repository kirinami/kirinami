import { useMemo } from 'react';

import { registerAction } from '@/slices/authSlice/actions';

import { useAction } from '../useAction';

export function useRegister() {
  const { loading, error, action: register } = useAction(registerAction, { lazy: true });

  return useMemo(() => ({ loading, error, register }), [error, loading, register]);
}
