import { login, refresh, register } from '@/server/services/auth';

import resolver from '../../resolver';

import { LoginArgs, RefreshArgs, RegisterArgs } from './types';

const resolvers = {
  Mutation: {
    login: resolver((_, { input }: LoginArgs) => login(input)),
    register: resolver((_, { input }: RegisterArgs) => register(input)),
    refresh: resolver((_, { token }: RefreshArgs) => refresh(token)),
  },
};

export default resolvers;
