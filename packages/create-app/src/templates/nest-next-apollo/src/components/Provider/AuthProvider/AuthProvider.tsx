import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { makeVar, useApolloClient, useReactiveVar } from '@apollo/client';

import { User } from '@/graphql/fragments/User';

const reactiveVar = makeVar({
  isLoginOpen: false,
  isRegisterOpen: false,
});

export type AuthContextValue = {
  user: User | null,
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

  const logout = useCallback(async () => {
    document.cookie = 'access-token=; path=/;';
    document.cookie = 'refresh-token=; path=/;';

    setUser(null);

    await apolloClient.resetStore();
  }, [apolloClient, setUser]);

  const { isLoginOpen, isRegisterOpen } = useReactiveVar(reactiveVar);

  const openLogin = useCallback(() => reactiveVar({ ...reactiveVar(), isLoginOpen: true }), []);
  const closeLogin = useCallback(() => reactiveVar({ ...reactiveVar(), isLoginOpen: false }), []);
  const openRegister = useCallback(() => reactiveVar({ ...reactiveVar(), isRegisterOpen: true }), []);
  const closeRegister = useCallback(() => reactiveVar({ ...reactiveVar(), isRegisterOpen: false }), []);

  const value = useMemo(() => ({
    user,
    logout,
    isLoginOpen,
    isRegisterOpen,
    openLogin,
    closeLogin,
    openRegister,
    closeRegister,
  }), [
    user,
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
