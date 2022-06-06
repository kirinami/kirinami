import { useCallback, useMemo } from 'react';
import { makeVar, useApolloClient, useMutation, useQuery, useReactiveVar } from '@apollo/client';

import { RETRIEVE_USER, RetrieveUserData, RetrieveUserVars } from '@/graphql/queries/users/retrieveUser';
import { LOGIN, LoginData, LoginVars } from '@/graphql/mutations/auth/login';
import { REGISTER, RegisterData, RegisterVars } from '@/graphql/mutations/auth/register';
import useIsReady from '@/hooks/useIsReady';

const reactiveVar = makeVar({
  isLoginOpen: false,
  isRegisterOpen: false,
});

export default function useAuth() {
  const isReady = useIsReady();

  const apolloClient = useApolloClient();

  const { isLoginOpen, isRegisterOpen } = useReactiveVar(reactiveVar);

  const { loading, error, data } = useQuery<RetrieveUserData, RetrieveUserVars>(RETRIEVE_USER, {
    errorPolicy: 'ignore',
  });

  const [loginMutation, loginResult] = useMutation<LoginData, LoginVars>(LOGIN);
  const [registerMutation, registerResult] = useMutation<RegisterData, RegisterVars>(REGISTER);

  const user = useMemo(() => data?.retrieveUser || null, [data?.retrieveUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { data, errors } = await loginMutation({
      variables: {
        email,
        password,
      },
    });

    if (errors?.length) {
      throw errors[0];
    }

    if (data?.login) {
      document.cookie = `access-token=${data.login.accessToken}; path=/;`;
      document.cookie = `refresh-token=${data.login.refreshToken}; path=/;`;

      await apolloClient.resetStore();
    }

    return data?.login;
  }, [apolloClient, loginMutation]);

  const register = useCallback(async (firstName: string, lastName: string, email: string, password: string) => {
    const { data, errors } = await registerMutation({
      variables: {
        firstName,
        lastName,
        email,
        password,
      },
    });

    if (errors?.length) {
      throw errors[0];
    }

    if (data?.register) {
      document.cookie = `access-token=${data.register.accessToken}; path=/;`;
      document.cookie = `refresh-token=${data.register.refreshToken}; path=/;`;

      await apolloClient.resetStore();
    }

    return data?.register;
  }, [apolloClient, registerMutation]);

  const logout = useCallback(async () => {
    document.cookie = 'access-token=; path=/;';
    document.cookie = 'refresh-token=; path=/;';

    await apolloClient.resetStore();
  }, [apolloClient]);

  const openLogin = useCallback(() => reactiveVar({ ...reactiveVar(), isLoginOpen: true }), []);

  const closeLogin = useCallback(() => reactiveVar({ ...reactiveVar(), isLoginOpen: false }), []);

  const openRegister = useCallback(() => reactiveVar({ ...reactiveVar(), isRegisterOpen: true }), []);

  const closeRegister = useCallback(() => reactiveVar({ ...reactiveVar(), isRegisterOpen: false }), []);

  return useMemo(() => ({
    isLoginOpen,
    isRegisterOpen,

    user,
    userLoading: isReady && loading,
    userError: error,

    login,
    loginLoading: loginResult.loading,
    loginError: loginResult.error,

    register,
    registerLoading: registerResult.loading,
    registerError: registerResult.error,

    logout,

    openLogin,
    closeLogin,
    openRegister,
    closeRegister,
  }), [
    isReady,

    isLoginOpen,
    isRegisterOpen,

    user,
    loading,
    error,

    login,
    loginResult.loading,
    loginResult.error,

    register,
    registerResult.loading,
    registerResult.error,

    logout,

    openLogin,
    closeLogin,
    openRegister,
    closeRegister,
  ]);
}
