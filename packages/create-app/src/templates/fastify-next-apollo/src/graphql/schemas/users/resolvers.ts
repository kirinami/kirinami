import bcrypt from 'bcryptjs';

import prisma from '@/prisma/client';

import isAuthenticated from '../../guards/isAuthenticated';
import resolver from '../../utils/resolver';

import { CreateUserArgs, DeleteUserArgs, GetUserByArgs, GetUsersArgs, UpdateUserArgs } from './types';

const resolvers = {
  Query: {
    getUsers: resolver([isAuthenticated('Admin')], async (_, { search }: GetUsersArgs) => {
      if (search && search.length < 3) {
        return {
          users: [],
          total: 0,
        };
      }

      return prisma.user.findMany({
        ...search
          ? {
            where: {
              OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
              ],
            },
          }
          : {},
      });
    }),
    getUserBy: resolver([isAuthenticated()], async (_, { id }: GetUserByArgs, { currentUser }) => {
      id = id || currentUser!.id;

      if (!currentUser!.roles.includes('Admin') && currentUser!.id !== id) {
        throw new Error('Forbidden');
      }

      return prisma.user.findUnique({
        where: {
          id,
        },
      });
    }),
  },
  Mutation: {
    createUser: resolver([isAuthenticated('Admin')], async (_, { input }: CreateUserArgs) => {
      const password = await bcrypt.hash(input.password, 10);
      const roles = input.roles || ['User'];

      return prisma.user.create({
        data: { ...input, password, roles },
      });
    }),
    updateUser: resolver([isAuthenticated()], async (_, { id, input }: UpdateUserArgs, { currentUser }) => {
      id = id || currentUser!.id;

      if (!currentUser!.roles.includes('Admin')) {
        if (currentUser!.id !== id) {
          throw new Error('Forbidden');
        }

        delete input.roles;
      }

      const password = input.password ? await bcrypt.hash(input.password, 10) : undefined;

      return prisma.user.update({
        where: {
          id,
        },
        data: { ...input, password },
      });
    }),
    deleteUser: resolver([isAuthenticated('Admin')], async (_, { id }: DeleteUserArgs) => {
      return prisma.user.delete({
        where: {
          id,
        },
      });
    }),
  },
};

export default resolvers;
