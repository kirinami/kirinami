import { createContext, ReactNode, useCallback, useMemo } from 'react';
import { makeVar, useApolloClient } from '@apollo/client';

import {
  LoginInput,
  RegisterInput,
  useCurrentUserQuery,
  useLoginMutation,
  useRegisterMutation,
  UserQuery,
} from '@/graphql/client';
import useIsReady from '@/hooks/useIsReady';

const reactiveVar = makeVar({
  isLoginOpen: false,
  isRegisterOpen: false,
});

export type AuthContextValue = {
  user: UserQuery['user'] | null;
  login: (input: LoginInput) => Promise<void>;
  loginLoading: boolean;
  loginError?: Error;
  register: (input: RegisterInput) => Promise<void>;
  registerLoading: boolean;
  registerError?: Error;
  logout: () => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextValue);

export type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const apolloClient = useApolloClient();

  const isReady = useIsReady();

  const { loading, data } = useCurrentUserQuery();

  const [loginMutation, loginResult] = useLoginMutation();
  const [registerMutation, registerResult] = useRegisterMutation();

  const user = useMemo(() => data?.currentUser || null, [data?.currentUser]);

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

  const logout = useCallback(async () => {
    document.cookie = 'access-token=; path=/;';
    document.cookie = 'refresh-token=; path=/;';

    await apolloClient.resetStore();
  }, [apolloClient]);

  const value = useMemo(
    () => ({
      user,
      login,
      loginLoading: isReady && (loading || loginResult.loading),
      loginError: loginResult.error,
      register,
      registerLoading: isReady && (loading || registerResult.loading),
      registerError: registerResult.error,
      logout,
    }),
    [
      isReady,
      user,
      loading,
      login,
      loginResult.loading,
      loginResult.error,
      register,
      registerResult.loading,
      registerResult.error,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
