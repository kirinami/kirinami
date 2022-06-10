import { Injectable, NotFoundException } from '@nestjs/common';
import { omit } from 'lodash';

import { Prisma } from '@/api/prisma/prisma.client';
import { PrismaService } from '@/api/prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async findAll({ page = 1, size = 10, ...args }: { page?: number, size?: number } & Prisma.TodoFindManyArgs) {
    const [todos, total] = await Promise.all([
      this.prismaService.todo.findMany({
        orderBy: {
          id: 'desc',
        },
        skip: Math.abs(size * (page - 1)),
        take: Math.abs(size),
        ...args,
      }),
      this.prismaService.todo.count({
        ...omit(args, ['select', 'include']),
      }),
    ]);

    return {
      todos,
      total,
    };
  }

  async findOne(args: Prisma.TodoFindFirstArgs) {
    return this.prismaService.todo.findFirst(args);
  }

  async create(args: Prisma.TodoCreateArgs) {
    return this.prismaService.todo.create(args);
  }

  async update(args: Prisma.TodoUpdateArgs) {
    try {
      return await this.prismaService.todo.update(args);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException();
        }
      }

      throw err;
    }
  }

  async remove(args: Prisma.TodoDeleteArgs) {
    try {
      return await this.prismaService.todo.delete(args);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException();
        }
      }

      throw err;
    }
  }
}
