import { useMemo } from 'react';

import { logoutAction } from '@/slices/authSlice/actions';

import { useAction } from '../useAction';

export function useLogout() {
  const { loading, error, action: logout } = useAction(logoutAction, { lazy: true });

  return useMemo(() => ({ loading, error, logout }), [error, loading, logout]);
}
