import { createContext, ReactNode, useCallback, useMemo } from 'react';
import { makeVar, useApolloClient, useMutation, useQuery, useReactiveVar } from '@apollo/client';

import { User } from '@/graphql/fragments/User';
import { LOGIN, LoginData, LoginVars } from '@/graphql/mutations/auth/login';
import { REGISTER, RegisterData, RegisterVars } from '@/graphql/mutations/auth/register';
import { FIND_ONE_USER, FindOneUserData, FindOneUserVars } from '@/graphql/queries/users/findOneUser';

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
  children: ReactNode,
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const apolloClient = useApolloClient();

  const { loading, data } = useQuery<FindOneUserData, FindOneUserVars>(FIND_ONE_USER);

  const [loginMutation, loginResult] = useMutation<LoginData, LoginVars>(LOGIN);
  const [registerMutation, registerResult] = useMutation<RegisterData, RegisterVars>(REGISTER);

  const user = useMemo(() => data?.findOneUser || null, [data?.findOneUser]);

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

    await apolloClient.resetStore();
  }, [apolloClient, loginMutation]);

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

    await apolloClient.resetStore();
  }, [apolloClient, registerMutation]);

  const logout = useCallback(async () => {
    document.cookie = 'access-token=; path=/;';
    document.cookie = 'refresh-token=; path=/;';

    await apolloClient.resetStore();
  }, [apolloClient]);

  const { isLoginOpen, isRegisterOpen } = useReactiveVar(reactiveVar);

  const openLogin = useCallback(() => reactiveVar({ ...reactiveVar(), isLoginOpen: true }), []);
  const closeLogin = useCallback(() => reactiveVar({ ...reactiveVar(), isLoginOpen: false }), []);
  const openRegister = useCallback(() => reactiveVar({ ...reactiveVar(), isRegisterOpen: true }), []);
  const closeRegister = useCallback(() => reactiveVar({ ...reactiveVar(), isRegisterOpen: false }), []);

  const value = useMemo(() => ({
    user,
    login,
    loginLoading: loading || loginResult.loading,
    loginError: loginResult.error,
    register,
    registerLoading: loading || registerResult.loading,
    registerError: registerResult.error,
    logout,
    isLoginOpen,
    isRegisterOpen,
    openLogin,
    closeLogin,
    openRegister,
    closeRegister,
  }), [
    user,
    loading,
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
