import prisma, { Todo } from '@/prisma/client';
import isAuthenticated from '@/api/graphql/guards/isAuthenticated';
import resolver from '@/api/graphql/resolver';
import {
  createTodoForUser,
  deleteTodoForUser,
  findAllTodosForUserWithPagination,
  findOneTodoByIdForUser,
  updateTodoForUser,
} from '@/api/services/todos';

import { CreateTodoArgs, DeleteTodoArgs, FindAllTodosArgs, FindOneTodoArgs, UpdateTodoArgs } from './types';

const resolvers = {
  Todo: {
    user: resolver((parent: Todo) => prisma.user.findUnique({
      where: {
        id: parent.userId,
      },
    })),
  },
  Query: {
    findAllTodos: resolver(
      [isAuthenticated()],
      (_, { my, page = 1, size = 10 }: FindAllTodosArgs, { currentUser }) =>
        findAllTodosForUserWithPagination(currentUser!, my, page, size),
    ),
    findOneTodo: resolver(
      [isAuthenticated()],
      (_, { id }: FindOneTodoArgs, { currentUser }) => findOneTodoByIdForUser(currentUser!, id),
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
