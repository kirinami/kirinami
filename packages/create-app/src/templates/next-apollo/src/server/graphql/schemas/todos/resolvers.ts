import { PubSub } from 'graphql-subscriptions';

import prisma, { Todo } from '@/server/prisma/client';
import {
  createTodoForUser,
  deleteTodoForUser,
  findAllTodosForUserWithPagination,
  findOneTodoByIdForUser,
  updateTodoForUser,
} from '@/server/services/todos';

import isAuthenticated from '../../guards/isAuthenticated';
import resolver from '../../resolver';

import { CreateTodoArgs, DeleteTodoArgs, FindAllTodosArgs, FindOneTodoArgs, UpdateTodoArgs } from './types';

const pubSub = new PubSub();

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
      async (_, { input }: CreateTodoArgs, { currentUser }) => {
        const todo = await createTodoForUser(currentUser!, input);

        await pubSub.publish('TODO_CREATED', {
          todoCreated: todo,
        });

        return todo;
      },
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
  Subscription: {
    todoCreated: {
      subscribe: resolver([isAuthenticated()], async () => pubSub.asyncIterator('TODO_CREATED')),
    },
  },
};

export default resolvers;
