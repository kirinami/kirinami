import request from '@/utils/request';

export type Auth = {
  accessToken: string,
  refreshToken: string,
};

const usersApi = {
  login: (email: string, password: string) => request<Auth>('POST', '/auth/login', {
    email,
    password,
  }),
  register: (firstName: string, lastName: string, email: string, password: string) => request<Auth>('POST', '/auth/register', {
    firstName,
    lastName,
    email,
    password,
  }),
  refresh: (refreshToken: string) => request<Auth>('POST', '/auth/refresh', {
    refreshToken,
  }),
};

export default usersApi;
