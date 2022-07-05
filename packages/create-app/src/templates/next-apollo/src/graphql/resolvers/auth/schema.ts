import { login, refresh, register } from '@/services/auth';

import { Resolvers } from '../../schema';

const resolvers: Resolvers = {
  Mutation: {
    login: (_, { input }) => login(input),
    register: (_, { input }) => register(input),
    refresh: (_, { token }) => refresh(token),
  },
};

export default resolvers;
