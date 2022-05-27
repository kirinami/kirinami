import { createContext, ReactNode, useState } from 'react';

import { User } from '@/helpers/api/usersApi';

export type AuthContextValue = {
  user?: User,
  isOpenLoginModal: boolean,
  setIsOpenLoginModal: (value: boolean) => void,
  isOpenRegisterModal: boolean,
  setIsOpenRegisterModal: (value: boolean) => void,
};

export const AuthContext = createContext({} as AuthContextValue);

export type AuthProviderProps = {
  user?: User,
  children: ReactNode,
};

export default function AuthProvider({ user, children }: AuthProviderProps) {
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [isOpenRegisterModal, setIsOpenRegisterModal] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isOpenLoginModal,
        setIsOpenLoginModal,
        isOpenRegisterModal,
        setIsOpenRegisterModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
