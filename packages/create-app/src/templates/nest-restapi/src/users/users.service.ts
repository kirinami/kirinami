import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { Prisma, User } from '@prisma/client';

import { CryptoService } from '@/common/services/crypto.service';
import { PrismaService } from '@/common/services/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly prismaService: PrismaService,
  ) {}

  async findManyPagination(page: number, size: number) {
    return this.prismaService.$transaction([
      this.prismaService.user.findMany({
        orderBy: {
          id: 'desc',
        },
        skip: size * (page - 1),
        take: size,
      }),
      this.prismaService.user.count(),
    ]);
  }

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

      const match = this.cryptoService.compare(password, user.password);

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
        data: { ...input, password: this.cryptoService.hash(password) },
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
        data: { ...input, password: password ? this.cryptoService.hash(password.toString()) : undefined },
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
