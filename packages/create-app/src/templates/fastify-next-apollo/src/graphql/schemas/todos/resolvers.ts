import omit from 'lodash/omit';

import prisma, { Todo } from '@/prisma/client';

import isAuthenticated from '../../guards/isAuthenticated';
import resolver from '../../utils/resolver';

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
    getTodos: resolver([isAuthenticated()], (_, { my }: GetTodosArgs, { currentUser }) => {
      return prisma.todo.findMany({
        where: {
          userId: !currentUser!.roles.includes('Admin') || my ? currentUser!.id : undefined,
        },
      });
    }),
    getTodoBy: resolver([isAuthenticated()], (_, { id }: GetTodoByArgs, { currentUser }) => {
      return prisma.todo.findUnique({
        where: currentUser!.roles.includes('Admin') ? { id } : { id_userId: { id, userId: currentUser!.id } },
      });
    }),
  },
  Mutation: {
    createTodo: resolver([isAuthenticated()], async (_, { input }: CreateTodoArgs, { currentUser }) => {
      const userId = input.userId || currentUser!.id;

      if (!currentUser!.roles.includes('Admin') && currentUser!.id !== userId) {
        throw new Error('Forbidden');
      }

      return prisma.todo.create({
        data: {
          ...omit(input, ['userId']),
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
    updateTodo: resolver([isAuthenticated()], async (_, { id, input }: UpdateTodoArgs, { currentUser }) => {
      const userId = input.userId || currentUser!.id;

      if (!currentUser!.roles.includes('Admin') && currentUser!.id !== userId) {
        throw new Error('Forbidden');
      }

      return prisma.todo.update({
        where: currentUser!.roles.includes('Admin') ? { id } : { id_userId: { id, userId: currentUser!.id } },
        data: {
          ...omit(input, ['userId']),
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
    deleteTodo: resolver([isAuthenticated()], async (_, { id }: DeleteTodoArgs, { currentUser }) => {
      return prisma.todo.delete({
        where: currentUser!.roles.includes('Admin') ? { id } : { id_userId: { id, userId: currentUser!.id } },
      });
    }),
  },
};

export default resolvers;
