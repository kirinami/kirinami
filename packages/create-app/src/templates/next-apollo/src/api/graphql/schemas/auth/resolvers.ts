import resolver from '@/api/graphql/resolver';
import { login, refresh, register } from '@/api/services/auth';

import { LoginArgs, RefreshArgs, RegisterArgs } from './types';

const resolvers = {
  Mutation: {
    login: resolver((_, { input }: LoginArgs) => login(input)),
    register: resolver((_, { input }: RegisterArgs) => register(input)),
    refresh: resolver((_, { token }: RefreshArgs) => refresh(token)),
  },
};

export default resolvers;
