import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { makeVar, useApolloClient, useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';

import { User } from '@/graphql/fragments/User';
import { RETRIEVE_USER, RetrieveUserData, RetrieveUserVars } from '@/graphql/queries/users/retrieveUser';
import { LOGIN, LoginData, LoginVars } from '@/graphql/mutations/auth/login';
import { REGISTER, RegisterData, RegisterVars } from '@/graphql/mutations/auth/register';

const reactiveVar = makeVar({
  isLoginOpen: false,
  isRegisterOpen: false,
});

export type AuthContextValue = {
  user: User | null,
  login: (input: LoginVars['input']) => Promise<void>,
  loginLoading: boolean,
  loginError?: Error,
  register: (input: RegisterVars['input']) => Promise<void>,
  registerLoading: boolean,
  registerError?: Error,
  logout: () => Promise<void>,
  isLoginOpen: boolean,
  isRegisterOpen: boolean,
  openLogin: () => void,
  closeLogin: () => void,
  openRegister: () => void,
  closeRegister: () => void,
};

export const AuthContext = createContext({} as AuthContextValue);

export type AuthProviderProps = {
  user: User | null,
  children: ReactNode,
};

export default function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [user, setUser] = useState(props.user);

  const apolloClient = useApolloClient();

  const [retrieveUserQuery, retrieveUserResult] = useLazyQuery<RetrieveUserData, RetrieveUserVars>(RETRIEVE_USER, {
    fetchPolicy: 'no-cache',
  });

  const [loginMutation, loginResult] = useMutation<LoginData, LoginVars>(LOGIN);
  const [registerMutation, registerResult] = useMutation<RegisterData, RegisterVars>(REGISTER);

  const retrieveUser = useCallback(async () => {
    const { error, data } = await retrieveUserQuery();

    if (error) {
      throw error;
    }

    setUser(data?.retrieveUser || null);

    await apolloClient.resetStore();
  }, [setUser, apolloClient, retrieveUserQuery]);

  const login = useCallback(async (input: LoginVars['input']) => {
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

    await retrieveUser();
  }, [loginMutation, retrieveUser]);

  const register = useCallback(async (input: RegisterVars['input']) => {
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

    await retrieveUser();
  }, [registerMutation, retrieveUser]);

  const logout = useCallback(async () => {
    document.cookie = 'access-token=; path=/;';
    document.cookie = 'refresh-token=; path=/;';

    setUser(null);

    await apolloClient.resetStore();
  }, [setUser, apolloClient]);

  const { isLoginOpen, isRegisterOpen } = useReactiveVar(reactiveVar);

  const openLogin = useCallback(() => reactiveVar({ ...reactiveVar(), isLoginOpen: true }), []);
  const closeLogin = useCallback(() => reactiveVar({ ...reactiveVar(), isLoginOpen: false }), []);
  const openRegister = useCallback(() => reactiveVar({ ...reactiveVar(), isRegisterOpen: true }), []);
  const closeRegister = useCallback(() => reactiveVar({ ...reactiveVar(), isRegisterOpen: false }), []);

  const value = useMemo(() => ({
    user,
    login,
    loginLoading: retrieveUserResult.loading || loginResult.loading,
    loginError: retrieveUserResult.error || loginResult.error,
    register,
    registerLoading: retrieveUserResult.loading || registerResult.loading,
    registerError: retrieveUserResult.error || registerResult.error,
    logout,
    isLoginOpen,
    isRegisterOpen,
    openLogin,
    closeLogin,
    openRegister,
    closeRegister,
  }), [
    user,
    retrieveUserResult.loading,
    retrieveUserResult.error,
    login,
    loginResult.loading,
    loginResult.error,
    register,
    registerResult.loading,
    registerResult.error,
    logout,
    isLoginOpen,
    isRegisterOpen,
    openLogin,
    closeLogin,
    openRegister,
    closeRegister,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
