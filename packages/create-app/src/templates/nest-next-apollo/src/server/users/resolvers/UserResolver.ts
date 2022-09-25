import { BadRequestException, DefaultValuePipe, NotFoundException } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import bcrypt from 'bcryptjs';

import { type User, Prisma } from '@/prisma/client';

import CurrentUser from '../../auth/decorators/CurrentUser';
import JwtAccess from '../../auth/decorators/JwtAccess';
import RolesAccess from '../../auth/decorators/RolesAccess';
import PrismaService from '../../utils/prisma/PrismaService';
import CreateUserInput from '../dto/CreateUserInput';
import UpdateUserInput from '../dto/UpdateUserInput';
import UserPaginationType from '../dto/UserPaginationType';
import UserType from '../dto/UserType';

@JwtAccess()
@Resolver(() => UserType)
export default class UserResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query(() => UserType)
  async currentUser(@CurrentUser() user?: User) {
    return user;
  }

  @RolesAccess(['Admin'])
  @Query(() => [UserType])
  async users() {
    return this.prismaService.user.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  @RolesAccess(['Admin'])
  @Query(() => UserPaginationType)
  async usersWithPagination(
    @Args('page', { type: () => Int, nullable: true }, new DefaultValuePipe(1)) page: number,
    @Args('size', { type: () => Int, nullable: true }, new DefaultValuePipe(10)) size: number
  ) {
    const [items, total] = await Promise.all([
      this.prismaService.user.findMany({
        orderBy: {
          id: 'desc',
        },
        skip: Math.abs(size * (page - 1)),
        take: Math.abs(size),
      }),
      this.prismaService.user.count(),
    ]);

    return { items, total };
  }

  @RolesAccess(['Admin'])
  @Query(() => UserType)
  async user(@Args('id', { type: () => Int }) id: number) {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException();
        }
      }

      throw err;
    }
  }

  @RolesAccess(['Admin'])
  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserInput) {
    try {
      const password = await bcrypt.hash(input.password, 10);

      return await this.prismaService.user.create({
        data: { ...input, password },
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

  @RolesAccess(['Admin'])
  @Mutation(() => UserType)
  async updateUser(@Args('input') { id, ...input }: UpdateUserInput) {
    try {
      const password = input.password ? await bcrypt.hash(input.password, 10) : undefined;

      return await this.prismaService.user.update({
        where: {
          id,
        },
        data: { ...input, password },
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

  @RolesAccess(['Admin'])
  @Mutation(() => UserType)
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    try {
      return await this.prismaService.user.delete({
        where: {
          id,
        },
      });
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
