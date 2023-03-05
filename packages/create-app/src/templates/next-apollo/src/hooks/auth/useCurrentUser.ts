import { useMemo } from 'react';

import { useCurrentUserQuery } from '@/graphql/client';

export function useCurrentUser() {
  const { loading, error, data, refetch } = useCurrentUserQuery();

  return useMemo(
    () => ({
      loading,
      error,
      currentUser: data?.currentUser,
      refetch,
    }),
    [loading, error, data?.currentUser, refetch]
  );
}
