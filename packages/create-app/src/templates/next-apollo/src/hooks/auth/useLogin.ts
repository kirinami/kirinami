import { useCallback, useMemo } from 'react';
import { useApolloClient } from '@apollo/client';

import { LoginInput, useLoginMutation } from '@/graphql/client';

export function useLogin() {
  const apolloClient = useApolloClient();

  const [loginMutation, { loading, error }] = useLoginMutation();

  const login = useCallback(
    async (input: LoginInput) => {
      const { data, errors } = await loginMutation({
        variables: {
          input,
        },
      });

      if (errors?.length) {
        throw errors[0];
      }

      if (data?.login) {
        document.cookie = `access-token=${data.login.accessToken}; path=/;`;
        document.cookie = `refresh-token=${data.login.refreshToken}; path=/;`;
      }

      await apolloClient.resetStore();
    },
    [apolloClient, loginMutation]
  );

  return useMemo(() => ({ loading, error, login }), [loading, error, login]);
}
