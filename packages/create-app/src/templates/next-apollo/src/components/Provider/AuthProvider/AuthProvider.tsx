import { createContext, ReactNode, useCallback, useMemo } from 'react';
import { makeVar, useApolloClient, useReactiveVar } from '@apollo/client';

import {
  FindOneUserQuery,
  LoginInput,
  RegisterInput,
  useFindOneUserQuery,
  useLoginMutation,
  useRegisterMutation,
} from '@/graphql/client';

const reactiveVar = makeVar({
  isLoginOpen: false,
  isRegisterOpen: false,
});

export type AuthContextValue = {
  user: FindOneUserQuery['findOneUser'];
  login: (input: LoginInput) => Promise<void>;
  loginLoading: boolean;
  loginError?: Error;
  register: (input: RegisterInput) => Promise<void>;
  registerLoading: boolean;
  registerError?: Error;
  logout: () => Promise<void>;
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  openRegister: () => void;
  closeRegister: () => void;
};

export const AuthContext = createContext({} as AuthContextValue);

export type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const apolloClient = useApolloClient();

  const { loading, data } = useFindOneUserQuery();

  const [loginMutation, loginResult] = useLoginMutation();
  const [registerMutation, registerResult] = useRegisterMutation();

  const user = useMemo(() => data?.findOneUser || null, [data?.findOneUser]);

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

  const { isLoginOpen, isRegisterOpen } = useReactiveVar(reactiveVar);

  const openLogin = useCallback(() => reactiveVar({ ...reactiveVar(), isLoginOpen: true }), []);
  const closeLogin = useCallback(() => reactiveVar({ ...reactiveVar(), isLoginOpen: false }), []);
  const openRegister = useCallback(() => reactiveVar({ ...reactiveVar(), isRegisterOpen: true }), []);
  const closeRegister = useCallback(() => reactiveVar({ ...reactiveVar(), isRegisterOpen: false }), []);

  const value = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
