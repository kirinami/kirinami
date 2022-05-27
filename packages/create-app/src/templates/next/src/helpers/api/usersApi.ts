import request from '@/utils/request';

export type User = {
  id: number,
  firstName: string,
  lastName: string,
};

const usersApi = {
  getProfile: () => request<User>('GET', '/users/profile'),
};

export default usersApi;
