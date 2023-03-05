import { useCallback, useMemo } from 'react';
import { useApolloClient } from '@apollo/client';

export function useLogout() {
  const apolloClient = useApolloClient();

  const logout = useCallback(async () => {
    document.cookie = 'access-token=; path=/;';
    document.cookie = 'refresh-token=; path=/;';

    await apolloClient.resetStore();
  }, [apolloClient]);

  return useMemo(() => ({ loading: false, error: null, logout }), [logout]);
}
