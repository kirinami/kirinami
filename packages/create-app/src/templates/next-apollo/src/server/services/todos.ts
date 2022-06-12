import omit from 'lodash/omit';

import prisma, { Prisma, User } from '@/server/prisma/client';

import { CreateTodoArgs, UpdateTodoArgs } from '../graphql/schemas/todos/types';

export async function findAllTodosForUserWithPagination(user: User, my?: boolean, page = 1, size = 10) {
  const where = {
    userId: !user.roles.includes('Admin') || my ? user.id : undefined,
  };

  const [todos, total] = await Promise.all([
    prisma.todo.findMany({
      where,
      orderBy: {
        id: 'desc',
      },
      skip: Math.abs(size * (page - 1)),
      take: Math.abs(size),
    }),
    prisma.todo.count({
      where,
    }),
  ]);

  return {
    todos,
    total,
  };
}

export async function findOneTodoByIdForUser(user: User, id: number) {
  return prisma.todo.findUnique({
    where: user.roles.includes('Admin') ? { id } : { id_userId: { id, userId: user.id } },
  });
}

export async function createTodoForUser(user: User, input: CreateTodoArgs['input']) {
  const userId = input.userId || user.id;

  if (!user.roles.includes('Admin') && user.id !== userId) {
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
}

export async function updateTodoForUser(user: User, id: number, input: UpdateTodoArgs['input']) {
  try {
    const userId = input.userId || user.id;

    if (!user.roles.includes('Admin') && user.id !== userId) {
      throw new Error('Forbidden');
    }

    return await prisma.todo.update({
      where: user.roles.includes('Admin') ? { id } : { id_userId: { id, userId: user.id } },
      data: {
        ...omit(input, ['userId']),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        throw new Error('Todo Not Found');
      }
    }

    throw err;
  }
}

export async function deleteTodoForUser(user: User, id: number) {
  try {
    return await prisma.todo.delete({
      where: user.roles.includes('Admin') ? { id } : { id_userId: { id, userId: user.id } },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        throw new Error('Todo Not Found');
      }
    }

    throw err;
  }
}
