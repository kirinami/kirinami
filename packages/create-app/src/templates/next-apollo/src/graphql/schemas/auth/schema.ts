import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Resolvers } from '@/graphql/client';
import { login, refresh, register } from '@/services/auth';

const resolvers: Resolvers = {
  Mutation: {
    login: (_, { input }) => login(input),
    register: (_, { input }) => register(input),
    refresh: (_, { token }) => refresh(token),
  },
};

export default {
  typeDefs: fs.readFileSync(path.resolve(fileURLToPath(import.meta.url), '..', './schema.graphql'), 'utf-8'),
  resolvers,
};
