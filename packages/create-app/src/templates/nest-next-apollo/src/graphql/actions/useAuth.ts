import { useCallback, useMemo } from 'react';
import { makeVar, useApolloClient, useMutation, useQuery, useReactiveVar } from '@apollo/client';

import useIsReady from '@/hooks/useIsReady';

import { GET_CURRENT_USER, RetrieveUser } from '../queries/users/retrieveUser';
import { LOGIN_MUTATION, LoginInput, LoginMutation } from '../mutations/auth/login';
import { REGISTER_MUTATION, RegisterInput, RegisterMutation } from '../mutations/auth/register';

const reactiveVar = makeVar({
  isLoginOpen: false,
  isRegisterOpen: false,
});

export default function useAuth() {
  const isReady = useIsReady();

  const apolloClient = useApolloClient();

  const { isLoginOpen, isRegisterOpen } = useReactiveVar(reactiveVar);

  const getCurrentUserResult = useQuery<RetrieveUser>(GET_CURRENT_USER, {
    errorPolicy: 'ignore',
  });

  const [loginMutation, loginMutationResult] = useMutation<LoginMutation, LoginInput>(LOGIN_MUTATION);
  const [registerMutation, registerMutationResult] = useMutation<RegisterMutation, RegisterInput>(REGISTER_MUTATION);

  const user = useMemo(() => getCurrentUserResult.data?.getCurrentUser || null, [getCurrentUserResult.data?.getCurrentUser]);

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
    userLoading: isReady && getCurrentUserResult.loading,
    userError: getCurrentUserResult.error,

    login,
    loginLoading: loginMutationResult.loading,
    loginError: loginMutationResult.error,

    register,
    registerLoading: registerMutationResult.loading,
    registerError: registerMutationResult.error,

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
    getCurrentUserResult.loading,
    getCurrentUserResult.error,

    login,
    loginMutationResult.loading,
    loginMutationResult.error,

    register,
    registerMutationResult.loading,
    registerMutationResult.error,

    logout,

    openLogin,
    closeLogin,
    openRegister,
    closeRegister,
  ]);
}
