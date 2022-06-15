import { PubSub, withFilter } from 'graphql-subscriptions';

import prisma, { Todo } from '@/prisma/client';
import {
  createTodoForUser,
  deleteTodoForUser,
  findAllTodosForUserWithPagination,
  findOneTodoByIdForUser,
  updateTodoForUser,
} from '@/api/services/todos';

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

        await pubSub.publish('onCreateTodo', {
          onCreateTodo: todo,
        });

        return todo;
      },
    ),
    updateTodo: resolver<unknown, AuthenticatedContext, UpdateTodoArgs>(
      isAuthenticated(),
      async (_, { id, input }, { currentUser }) => {
        const todo = await updateTodoForUser(currentUser, id, input);

        await pubSub.publish('onUpdateTodo', {
          onUpdateTodo: todo,
        });

        return todo;
      },
    ),
    deleteTodo: resolver<unknown, AuthenticatedContext, DeleteTodoArgs>(
      isAuthenticated(),
      async (_, { id }, { currentUser }) => {
        const todo = await deleteTodoForUser(currentUser, id);

        await pubSub.publish('onDeleteTodo', {
          onDeleteTodo: todo,
        });

        return todo;
      },
    ),
  },
  Subscription: {
    onCreateTodo: {
      subscribe: resolver(
        isAuthenticated(),
        withFilter(
          () => pubSub.asyncIterator('onCreateTodo'),
          ({ onCreateTodo }, args, { currentUser }) => onCreateTodo.userId === currentUser.id,
        ),
      ),
    },
    onUpdateTodo: {
      subscribe: resolver(
        isAuthenticated(),
        withFilter(
          () => pubSub.asyncIterator('onUpdateTodo'),
          ({ onUpdateTodo }, args, { currentUser }) => onUpdateTodo.userId === currentUser.id,
        ),
      ),
    },
    onDeleteTodo: {
      subscribe: resolver(
        isAuthenticated(),
        withFilter(
          () => pubSub.asyncIterator('onDeleteTodo'),
          ({ onDeleteTodo }, args, { currentUser }) => onDeleteTodo.userId === currentUser.id,
        ),
      ),
    },
  },
};

export default resolvers;
