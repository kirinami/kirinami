import bcrypt from 'bcryptjs';

import prisma, { Prisma, User } from '@/prisma/client';
import { CreateUserInput, UpdateUserInput } from '@/graphql/client';

export async function findAllUsersWithPagination(search?: string, page = 1, size = 10) {
  if (search && search.length < 3) {
    return {
      users: [],
      total: 0,
    };
  }

  const where: Prisma.UserWhereInput | undefined = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ],
      }
    : undefined;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: {
        id: 'desc',
      },
      skip: Math.abs(size * (page - 1)),
      take: Math.abs(size),
    }),
    prisma.user.count({
      where,
    }),
  ]);

  return {
    users,
    total,
  };
}

export async function fineOneUserByIdForUser(user: User, id?: number) {
  id = id || user.id;

  if (!user.roles.includes('Admin') && user.id !== id) {
    throw new Error('Forbidden');
  }

  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function createUser(input: CreateUserInput) {
  try {
    const password = await bcrypt.hash(input.password, 10);
    const roles = input.roles || ['User'];

    return await prisma.user.create({
      data: { ...input, password, roles },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new Error('Cannot be created with this email');
      }
    }

    throw err;
  }
}

export async function updateUserByUser(user: User, id: number, input: UpdateUserInput) {
  try {
    id = id || user.id;

    if (!user.roles.includes('Admin')) {
      if (user.id !== id) {
        throw new Error('Forbidden');
      }

      delete input.roles;
    }

    const password = input.password ? await bcrypt.hash(input.password, 10) : undefined;

    return await prisma.user.update({
      where: {
        id,
      },
      data: { ...(input as any), password },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new Error('Cannot be created with this email');
      } else if (err.code === 'P2025') {
        throw new Error('User Not Found');
      }
    }

    throw err;
  }
}

export async function deleteUser(id: number) {
  try {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        throw new Error('User Not Found');
      }
    }

    throw err;
  }
}
