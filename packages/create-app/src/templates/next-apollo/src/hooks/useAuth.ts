import { makeVar, useApolloClient, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useCallback, useMemo } from 'react';

import { USERS_PROFILE_QUERY, UsersProfileQuery } from '@/stores/todos/queries/users/usersProfile';
import { LOGIN_MUTATION, LoginInput, LoginMutation } from '@/stores/todos/mutations/auth/login';
import { REGISTER_MUTATION, RegisterInput, RegisterMutation } from '@/stores/todos/mutations/auth/register';

const reactiveVar = makeVar({
  isLoginOpen: false,
  isRegisterOpen: false,
});

export default function useAuth() {
  const apolloClient = useApolloClient();

  const usersProfileQueryResult = useQuery<UsersProfileQuery>(USERS_PROFILE_QUERY, {
    errorPolicy: 'ignore',
  });

  const [loginMutation, loginMutationResult] = useMutation<LoginMutation, LoginInput>(LOGIN_MUTATION);
  const [registerMutation, registerMutationResult] = useMutation<RegisterMutation, RegisterInput>(REGISTER_MUTATION);

  const { isLoginOpen, isRegisterOpen } = useReactiveVar(reactiveVar);

  const loading = usersProfileQueryResult.loading
    || loginMutationResult.loading
    || registerMutationResult.loading;

  const error = usersProfileQueryResult.error
    || loginMutationResult.error
    || registerMutationResult.error;

  const user = useMemo(() => usersProfileQueryResult.data?.user || null, [usersProfileQueryResult.data?.user]);

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
      document.cookie = `accessToken=${data.login.accessToken}; path=/;`;
      document.cookie = `refreshToken=${data.login.refreshToken}; path=/;`;

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
      document.cookie = `accessToken=${data.register.accessToken}; path=/;`;
      document.cookie = `refreshToken=${data.register.refreshToken}; path=/;`;

      await apolloClient.resetStore();
    }

    return data?.register;
  }, [apolloClient, registerMutation]);

  const logout = useCallback(async () => {
    document.cookie = 'accessToken=; path=/;';
    document.cookie = 'refreshToken=; path=/;';

    await apolloClient.resetStore();
  }, [apolloClient]);

  const openLogin = useCallback(() => reactiveVar({ ...reactiveVar(), isLoginOpen: true }), []);

  const closeLogin = useCallback(() => reactiveVar({ ...reactiveVar(), isLoginOpen: false }), []);

  const openRegister = useCallback(() => reactiveVar({ ...reactiveVar(), isRegisterOpen: true }), []);

  const closeRegister = useCallback(() => reactiveVar({ ...reactiveVar(), isRegisterOpen: false }), []);

  return {
    isLoginOpen,
    isRegisterOpen,
    loading,
    error,
    user,
    login,
    register,
    logout,
    openLogin,
    closeLogin,
    openRegister,
    closeRegister,
  };
}
