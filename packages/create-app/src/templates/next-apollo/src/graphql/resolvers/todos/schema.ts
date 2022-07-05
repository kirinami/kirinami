import { PubSub, withFilter } from 'graphql-subscriptions';

import authenticateUser from '@/helpers/authenticateUser';
import {
  createTodoForUser,
  deleteTodoForUser,
  findAllTodosForUserWithPagination,
  findOneTodoByIdForUser,
  updateTodoForUser,
} from '@/services/todos';

import { Resolvers } from '../../schema';

const pubSub = new PubSub();

const resolvers: Resolvers = {
  Query: {
    findAllTodos: async (_, { my, page = 1, size = 10 }, ctx) => {
      const currentUser = await authenticateUser(ctx);
      return findAllTodosForUserWithPagination(currentUser, my ?? true, page, size);
    },
    findOneTodo: async (_, { id }, ctx) => {
      const currentUser = await authenticateUser(ctx);
      return findOneTodoByIdForUser(currentUser, id);
    },
  },
  Mutation: {
    createTodo: async (_, { input }, ctx) => {
      const currentUser = await authenticateUser(ctx);

      const todo = await createTodoForUser(currentUser, input);

      await pubSub.publish('onCreateTodo', {
        onCreateTodo: todo,
      });

      return todo;
    },
    updateTodo: async (_, { id, input }, ctx) => {
      const currentUser = await authenticateUser(ctx);

      const todo = await updateTodoForUser(currentUser, id, input);

      await pubSub.publish('onUpdateTodo', {
        onUpdateTodo: todo,
      });

      return todo;
    },
    deleteTodo: async (_, { id }, ctx) => {
      const currentUser = await authenticateUser(ctx);

      const todo = await deleteTodoForUser(currentUser, id);

      await pubSub.publish('onDeleteTodo', {
        onDeleteTodo: todo,
      });

      return todo;
    },
  },
  Subscription: {
    onCreateTodo: {
      subscribe: withFilter(
        () => pubSub.asyncIterator('onCreateTodo'),
        async ({ onCreateTodo }, args, ctx) => {
          const currentUser = await authenticateUser(ctx);
          return onCreateTodo.userId === currentUser.id;
        }
      ) as any,
    },
    onUpdateTodo: {
      subscribe: withFilter(
        () => pubSub.asyncIterator('onUpdateTodo'),
        async ({ onUpdateTodo }, args, ctx) => {
          const currentUser = await authenticateUser(ctx);
          return onUpdateTodo.userId === currentUser.id;
        }
      ) as any,
    },
    onDeleteTodo: {
      subscribe: withFilter(
        () => pubSub.asyncIterator('onDeleteTodo'),
        async ({ onDeleteTodo }, args, ctx) => {
          const currentUser = await authenticateUser(ctx);
          return onDeleteTodo.userId === currentUser.id;
        }
      ) as any,
    },
  },
};

export default resolvers;
