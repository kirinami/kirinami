import { useCallback, useMemo } from 'react';
import { useApolloClient } from '@apollo/client';

import { RegisterInput, useRegisterMutation } from '@/graphql/client';

export function useRegister() {
  const apolloClient = useApolloClient();

  const [registerMutation, { loading, error }] = useRegisterMutation();

  const register = useCallback(
    async (input: RegisterInput) => {
      const { data, errors } = await registerMutation({
        variables: {
          input,
        },
      });

      if (errors?.length) {
        throw errors[0];
      }

      if (data?.register) {
        document.cookie = `access-token=${data.register.accessToken}; path=/;`;
        document.cookie = `refresh-token=${data.register.refreshToken}; path=/;`;
      }

      await apolloClient.resetStore();
    },
    [apolloClient, registerMutation]
  );

  return useMemo(() => ({ loading, error, register }), [loading, error, register]);
}
