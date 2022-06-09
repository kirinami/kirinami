import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { omit } from 'lodash';
import bcrypt from 'bcryptjs';

import { PrismaService } from '@/api/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async findAll({ page = 1, size = 10, ...args }: { page?: number, size?: number } & Prisma.UserFindManyArgs) {
    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        orderBy: {
          id: 'desc',
        },
        skip: Math.abs(size * (page - 1)),
        take: Math.abs(size),
        ...args,
      }),
      this.prismaService.user.count({
        ...omit(args, ['select', 'include']),
      }),
    ]);

    return {
      users,
      total,
    };
  }

  async findOne(args: Prisma.UserFindFirstArgs) {
    return this.prismaService.user.findFirst(args);
  }

  async create({ data, ...args }: Prisma.UserCreateArgs) {
    try {
      const password = await bcrypt.hash(data.password, 10);
      const roles = data.roles || ['user'];

      return await this.prismaService.user.create({
        data: { ...data, password, roles },
        ...args,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new BadRequestException(['Cannot be created with this email']);
        }
      }

      throw err;
    }
  }

  async update({ data, ...args }: Prisma.UserUpdateArgs) {
    try {
      const password = typeof data.password === 'string' ? await bcrypt.hash(data.password, 10) : undefined;

      return await this.prismaService.user.update({
        data: { ...data, password },
        ...args,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new BadRequestException(['Cannot be created with this email']);
        } else if (err.code === 'P2025') {
          throw new NotFoundException();
        }
      }

      throw err;
    }
  }

  async remove(args: Prisma.UserDeleteArgs) {
    try {
      return await this.prismaService.user.delete(args);
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
