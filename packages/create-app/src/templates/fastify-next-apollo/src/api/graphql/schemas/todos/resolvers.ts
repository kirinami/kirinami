import prisma, { Todo } from '@/prisma/client';

import isAuthenticated from '@/api/graphql/guards/isAuthenticated';
import resolver from '@/api/graphql/resolver';
import {
  createTodoForUser,
  deleteTodoForUser,
  getTodoByIdForUser,
  getTodosForUserWithPagination,
  updateTodoForUser,
} from '@/api/services/todos';

import { CreateTodoArgs, DeleteTodoArgs, GetTodoByArgs, GetTodosArgs, UpdateTodoArgs } from './types';

const resolvers = {
  Todo: {
    user: resolver((parent: Todo) => {
      return prisma.user.findUnique({
        where: {
          id: parent.userId,
        },
      });
    }),
  },
  Query: {
    getTodos: resolver(
      [isAuthenticated()],
      (_, { my, page = 1, size = 10 }: GetTodosArgs, { currentUser }) =>
        getTodosForUserWithPagination(currentUser!, my, page, size),
    ),
    getTodoById: resolver(
      [isAuthenticated()],
      (_, { id }: GetTodoByArgs, { currentUser }) => getTodoByIdForUser(currentUser!, id),
    ),
  },
  Mutation: {
    createTodo: resolver(
      [isAuthenticated()],
      (_, { input }: CreateTodoArgs, { currentUser }) => createTodoForUser(currentUser!, input),
    ),
    updateTodo: resolver(
      [isAuthenticated()],
      (_, { id, input }: UpdateTodoArgs, { currentUser }) => updateTodoForUser(currentUser!, id, input),
    ),
    deleteTodo: resolver(
      [isAuthenticated()],
      (_, { id }: DeleteTodoArgs, { currentUser }) => deleteTodoForUser(currentUser!, id),
    ),
  },
};

export default resolvers;
