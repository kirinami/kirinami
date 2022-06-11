import isAuthenticated from '@/api/graphql/guards/isAuthenticated';
import resolver from '@/api/graphql/resolver';
import {
  createUser,
  deleteUser,
  findAllUsersWithPagination,
  fineOneUserByIdForUser,
  updateUserByUser,
} from '@/api/services/users';

import { CreateUserArgs, DeleteUserArgs, FindAllUsersArgs, FindOneUserArgs, UpdateUserArgs } from './types';

const resolvers = {
  Query: {
    findAllUsers: resolver(
      [isAuthenticated('Admin')],
      (_, { search, page = 1, size = 10 }: FindAllUsersArgs) => findAllUsersWithPagination(search, page, size),
    ),
    findOneUser: resolver(
      [isAuthenticated()],
      (_, { id }: FindOneUserArgs, { currentUser }) => fineOneUserByIdForUser(currentUser!, id),
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
