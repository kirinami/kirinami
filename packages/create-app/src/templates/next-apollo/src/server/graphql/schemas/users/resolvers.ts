import {
  createUser,
  deleteUser,
  findAllUsersWithPagination,
  fineOneUserByIdForUser,
  updateUserByUser,
} from '@/server/services/users';

import isAuthenticated, { AuthenticatedContext } from '../../guards/isAuthenticated';
import resolver from '../../resolver';

import { CreateUserArgs, DeleteUserArgs, FindAllUsersArgs, FindOneUserArgs, UpdateUserArgs } from './types';

const resolvers = {
  Query: {
    findAllUsers: resolver<unknown, AuthenticatedContext, FindAllUsersArgs>(
      isAuthenticated('Admin'),
      (_, { search, page = 1, size = 10 }) => findAllUsersWithPagination(search, page, size),
    ),
    findOneUser: resolver<unknown, AuthenticatedContext, FindOneUserArgs>(
      isAuthenticated(),
      (_, { id }, { currentUser }) => fineOneUserByIdForUser(currentUser, id),
    ),
  },
  Mutation: {
    createUser: resolver<unknown, AuthenticatedContext, CreateUserArgs>(
      isAuthenticated('Admin'),
      (_, { input }: CreateUserArgs) => createUser(input),
    ),
    updateUser: resolver<unknown, AuthenticatedContext, UpdateUserArgs>(
      isAuthenticated(),
      (_, { id, input }, { currentUser }) => updateUserByUser(currentUser, id, input),
    ),
    deleteUser: resolver<unknown, AuthenticatedContext, DeleteUserArgs>(
      isAuthenticated('Admin'),
      (_, { id }) => deleteUser(id),
    ),
  },
};

export default resolvers;
