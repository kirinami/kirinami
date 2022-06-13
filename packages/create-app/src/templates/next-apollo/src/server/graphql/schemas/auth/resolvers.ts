import { login, refresh, register } from '@/server/services/auth';

import resolver from '../../resolver';

import { LoginArgs, RefreshArgs, RegisterArgs } from './types';

const resolvers = {
  Mutation: {
    login: resolver<unknown, LoginArgs>((_, { input }) => login(input)),
    register: resolver<unknown, RegisterArgs>((_, { input }) => register(input)),
    refresh: resolver<unknown, RefreshArgs>((_, { token }) => refresh(token)),
  },
};

export default resolvers;
