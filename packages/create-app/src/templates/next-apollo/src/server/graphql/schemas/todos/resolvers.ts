import { PubSub } from 'graphql-subscriptions';

import prisma, { Todo } from '@prisma/client';
import {
  createTodoForUser,
  deleteTodoForUser,
  findAllTodosForUserWithPagination,
  findOneTodoByIdForUser,
  updateTodoForUser,
} from '@/server/services/todos';

import isAuthenticated, { AuthenticatedContext } from '../../guards/isAuthenticated';
import resolver from '../../resolver';

import { CreateTodoArgs, DeleteTodoArgs, FindAllTodosArgs, FindOneTodoArgs, UpdateTodoArgs } from './types';

const pubSub = new PubSub();

const resolvers = {
  Todo: {
    user: resolver<Todo>((parent) => prisma.user.findUnique({
      where: {
        id: parent.userId,
      },
    })),
  },
  Query: {
    findAllTodos: resolver<unknown, AuthenticatedContext, FindAllTodosArgs>(
      isAuthenticated(),
      (_, { my, page = 1, size = 10 }, { currentUser }) => findAllTodosForUserWithPagination(currentUser, my, page, size),
    ),
    findOneTodo: resolver<unknown, AuthenticatedContext, FindOneTodoArgs>(
      isAuthenticated(),
      (_, { id }: FindOneTodoArgs, { currentUser }) => findOneTodoByIdForUser(currentUser, id),
    ),
  },
  Mutation: {
    createTodo: resolver<unknown, AuthenticatedContext, CreateTodoArgs>(
      isAuthenticated(),
      async (_, { input }, { currentUser }) => {
        const todo = await createTodoForUser(currentUser, input);

        await pubSub.publish('TODO_CREATED', {
          todoCreated: todo,
        });

        return todo;
      },
    ),
    updateTodo: resolver<unknown, AuthenticatedContext, UpdateTodoArgs>(
      isAuthenticated(),
      (_, { id, input }, { currentUser }) => updateTodoForUser(currentUser, id, input),
    ),
    deleteTodo: resolver<unknown, AuthenticatedContext, DeleteTodoArgs>(
      isAuthenticated(),
      (_, { id }, { currentUser }) => deleteTodoForUser(currentUser, id),
    ),
  },
  Subscription: {
    todoCreated: {
      subscribe: resolver(isAuthenticated(), () => pubSub.asyncIterator('TODO_CREATED')),
    },
  },
};

export default resolvers;
