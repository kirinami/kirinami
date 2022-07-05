import authenticateUser from '@/helpers/authenticateUser';
import { createUser, deleteUser, findAllUsersWithPagination, fineOneUserByIdForUser, updateUserByUser } from '@/services/users';

import { Resolvers } from '../../schema';

const resolvers: Resolvers = {
  Query: {
    findAllUsers: async (_, { search, page = 1, size = 10 }, ctx) => {
      await authenticateUser(ctx);
      return findAllUsersWithPagination(search ?? '', page, size);
    },
    findOneUser: async (_, { id }, ctx) => {
      const currentUser = await authenticateUser(ctx);
      return fineOneUserByIdForUser(currentUser, id ?? undefined);
    },
  },
  Mutation: {
    createUser: async (_, { input }, ctx) => {
      await authenticateUser(ctx, 'Admin');
      return createUser(input);
    },
    updateUser: async (_, { id, input }, ctx) => {
      const currentUser = await authenticateUser(ctx);
      return updateUserByUser(currentUser, id, input);
    },
    deleteUser: async (_, { id }, ctx) => {
      await authenticateUser(ctx, 'Admin');
      return deleteUser(id);
    },
  },
};

export default resolvers;
