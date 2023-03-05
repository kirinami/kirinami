import { useMemo } from 'react';

import { currentUserAction } from '@/slices/authSlice/actions';
import { useCurrentUserSelector } from '@/slices/authSlice/selectors';

import { useAction } from '../useAction';

export function useCurrentUser() {
  const currentUser = useCurrentUserSelector();

  const { loading, error, action: refetch } = useAction(currentUserAction, { ssr: true });

  return useMemo(
    () => ({
      loading,
      error,
      refetch,
      currentUser,
    }),
    [loading, error, refetch, currentUser]
  );
}
