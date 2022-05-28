import { createContext, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import authApi from '@/helpers/api/authApi';
import usersApi, { User } from '@/helpers/api/usersApi';
import { headers } from '@/utils/request';
import parseCookie from '@/utils/parseCookie';

export type AuthContextValue = {
  loading: boolean,
  error?: string,
  user?: User,
  login: (email: string, password: string) => void,
  register: (firstName: string, lastName: string, email: string, password: string) => void,
  logout: () => void,
  subscribe: (type: 'login' | 'logout', listener: () => void) => () => void,
  isOpenLoginModal: boolean,
  openLoginModal: () => void,
  closeLoginModal: () => void,
  isOpenRegisterModal: boolean,
  openRegisterModal: () => void,
  closeRegisterModal: () => void,
};

export const AuthContext = createContext({} as AuthContextValue);

export type AuthProviderProps = {
  user?: User,
  children: ReactNode,
};

export default function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(props.user);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [isOpenRegisterModal, setIsOpenRegisterModal] = useState(false);

  const idRef = useRef(0);

  // eslint-disable-next-line no-spaced-func
  const listenersRef = useRef<Record<string, Record<string, () => void>>>({});

  const subscribe = useCallback((type: 'login' | 'logout', listener: () => void) => {
    idRef.current += 1;
    listenersRef.current[type] = listenersRef.current[type] || {};
    listenersRef.current[type][idRef.current] = listener;

    const id = idRef.current;

    return () => {
      delete listenersRef.current[type][id];
    };
  }, []);

  const dispatch = useCallback((type: 'login' | 'logout') => {
    Object.entries(listenersRef.current[type] || {}).forEach(([, listener]) => listener());
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      const auth = await authApi.login(email, password);
      document.cookie = `accessToken=${auth.accessToken}; path=/;`;
      document.cookie = `refreshToken=${auth.refreshToken}; path=/;`;
      headers.Authorization = `Bearer ${auth.accessToken}`;

      const user = await usersApi.getProfile();
      setUser(user);

      dispatch('login');
    } catch (err) {
      const error = new Error(err instanceof Error ? err.message : 'Undefined error occurred');
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const register = useCallback(async (firstName: string, lastName: string, email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      const auth = await authApi.register(firstName, lastName, email, password);
      document.cookie = `accessToken=${auth.accessToken}; path=/;`;
      document.cookie = `refreshToken=${auth.refreshToken}; path=/;`;
      headers.Authorization = `Bearer ${auth.accessToken}`;

      const user = await usersApi.getProfile();
      setUser(user);

      dispatch('login');
    } catch (err) {
      const error = new Error(err instanceof Error ? err.message : 'Undefined error occurred');
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    document.cookie = 'accessToken=; path=/;';
    document.cookie = 'refreshToken=; path=/;';
    headers.Authorization = '';

    setUser(undefined);

    dispatch('logout');
  }, [dispatch]);

  useEffect(() => {
    const cookies = parseCookie(document.cookie);

    headers.Authorization = cookies.accessToken ? `Bearer ${cookies.accessToken}` : '';
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        error,
        user,
        login,
        register,
        logout,
        subscribe,
        isOpenLoginModal,
        openLoginModal: () => setIsOpenLoginModal(true),
        closeLoginModal: () => setIsOpenLoginModal(false),
        isOpenRegisterModal,
        openRegisterModal: () => setIsOpenRegisterModal(true),
        closeRegisterModal: () => setIsOpenRegisterModal(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
