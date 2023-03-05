import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { Prisma, type User } from '@/prisma/client';
import PrismaService from '@/common/services/PrismaService';

@Injectable()
export default class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserById(id: number) {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') throw new NotFoundException();
      }

      throw err;
    }
  }

  async findUserByCredentials({ email, password }: Pick<User, 'email' | 'password'>) {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: {
          email,
        },
      });

      const match = await bcrypt.compare(password, user.password);

      if (!match) throw new UnauthorizedException();

      return user;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') throw new NotFoundException();
      }

      throw err;
    }
  }

  async createUser({ password, ...input }: Prisma.UserCreateInput) {
    try {
      return await this.prismaService.user.create({
        data: { ...input, password: await bcrypt.hash(password, 10) },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') throw new BadRequestException();
      }

      throw err;
    }
  }

  async updateUser(id: number, { password, ...input }: Prisma.UserUpdateInput) {
    try {
      return await this.prismaService.user.update({
        where: {
          id,
        },
        data: { ...input, password: password ? await bcrypt.hash(password.toString(), 10) : undefined },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') throw new BadRequestException();
        if (err.code === 'P2025') throw new NotFoundException();
      }

      throw err;
    }
  }

  async deleteUser(id: number) {
    try {
      return await this.prismaService.user.delete({
        where: {
          id,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') throw new NotFoundException();
      }

      throw err;
    }
  }
}
