import isAuthenticated from '@/api/graphql/guards/isAuthenticated';
import resolver from '@/api/graphql/resolver';
import { createUser, deleteUser, getUserByIdForUser, getUsersWithPagination, updateUserByUser } from '@/api/services/users';

import { CreateUserArgs, DeleteUserArgs, GetUserByArgs, GetUsersArgs, UpdateUserArgs } from './types';

const resolvers = {
  Query: {
    getUsers: resolver(
      [isAuthenticated('Admin')],
      (_, { search, page = 1, size = 10 }: GetUsersArgs) => getUsersWithPagination(search, page, size),
    ),
    getUserById: resolver(
      [isAuthenticated()],
      (_, { id }: GetUserByArgs, { currentUser }) => getUserByIdForUser(currentUser!, id),
    ),
  },
  Mutation: {
    createUser: resolver(
      [isAuthenticated('Admin')],
      (_, { input }: CreateUserArgs) => createUser(input),
    ),
    updateUser: resolver(
      [isAuthenticated()],
      (_, { id, input }: UpdateUserArgs, { currentUser }) => updateUserByUser(currentUser!, id, input),
    ),
    deleteUser: resolver(
      [isAuthenticated('Admin')],
      (_, { id }: DeleteUserArgs) => deleteUser(id),
    ),
  },
};

export default resolvers;
