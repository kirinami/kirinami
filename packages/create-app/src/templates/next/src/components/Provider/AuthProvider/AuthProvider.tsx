import { createContext, ReactNode, useCallback, useRef, useState } from 'react';

import authApi from '@/helpers/api/authApi';
import usersApi, { User } from '@/helpers/api/usersApi';
import { headers } from '@/utils/request';
import parseCookie from '@/utils/parseCookie';

class EventEmitter {
  id = 0;

  listeners: Record<string, Record<string, () => void>> = {};

  subscribe(type: string, listener: () => void) {
    this.id += 1;
    this.listeners[type] = this.listeners[type] || [];
    this.listeners[type][this.id] = listener;

    const id = this.id;

    return () => {
      delete this.listeners[type][id];
    };
  }

  dispatch(type: string) {
    Object.entries(this.listeners[type]).forEach(([, listener]) => listener());
  }
}

export type AuthContextValue = {
  loading: boolean,
  error?: string,
  user?: User,
  eventEmitter: EventEmitter,
  login: (email: string, password: string) => void,
  register: (firstName: string, lastName: string, email: string, password: string) => void,
  logout: () => void,
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

  const eventEmitterRef = useRef(new EventEmitter());

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

      eventEmitterRef.current.dispatch('login');
    } catch (err) {
      const error = new Error(err instanceof Error ? err.message : 'Undefined error occurred');
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

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

      eventEmitterRef.current.dispatch('login');
    } catch (err) {
      const error = new Error(err instanceof Error ? err.message : 'Undefined error occurred');
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    document.cookie = 'accessToken=; path=/;';
    document.cookie = 'refreshToken=; path=/;';
    headers.Authorization = '';

    setUser(undefined);

    eventEmitterRef.current.dispatch('logout');
  }, []);

  if (typeof window !== 'undefined') {
    const cookies = parseCookie(document.cookie);

    headers.Authorization = cookies.accessToken ? `Bearer ${cookies.accessToken}` : '';
  }

  return (
    <AuthContext.Provider
      value={{
        loading,
        error,
        user,
        eventEmitter: eventEmitterRef.current,
        login,
        register,
        logout,
        isOpenLoginModal,
        openLoginModal: () => setIsOpenLoginModal(true),
        closeLoginModal: () => setIsOpenLoginModal(false),
        isOpenRegisterModal,
        openRegisterModal: () => setIsOpenRegisterModal(true),
        closeRegisterModal: () => setIsOpenRegisterModal(true),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
