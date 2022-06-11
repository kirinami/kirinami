import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, registerEnumType, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { type User } from '@/api/prisma/prisma.client';
import { CurrentUser } from '@/api/auth/decorators/current-user.decorator';
import { JwtAccess } from '@/api/auth/decorators/jwt-access.decorator';
import { RolesAccess } from '@/api/auth/decorators/roles-access.decorator';

import { FindAllUsersArgs } from './args/find-all-users.args';
import { FindOneUserArgs } from './args/find-one-user.args';
import { CreateUserArgs } from './args/create-user.args';
import { UpdateUserArgs } from './args/update-user.args';
import { RemoveUserArgs } from './args/remove-user.args';
import { Role } from './enums/role.enum';
import { UserOutput } from './outputs/user.output';
import { UsersPaginationOutput } from './outputs/users-pagination.output';
import { UsersService } from './users.service';

@JwtAccess()
@Resolver(() => UserOutput)
export class UsersResolver {
  private readonly pubSub = new PubSub();

  constructor(private readonly usersService: UsersService) {
    registerEnumType(Role, {
      name: 'Role',
    });
  }

  @RolesAccess([Role.Admin])
  @Query(() => UsersPaginationOutput)
  async findAllUsers(@Args() { search, page, size }: FindAllUsersArgs) {
    if (search && search.length < 3) {
      return {
        users: [],
        total: 0,
      };
    }

    return this.usersService.findAll({
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
      page,
      size,
    });
  }

  @Query(() => UserOutput)
  async findOneUser(@CurrentUser() currentUser: User, @Args() { id }: FindOneUserArgs) {
    id = id || currentUser.id;

    if (!currentUser.roles.includes(Role.Admin) && currentUser.id !== id) {
      throw new ForbiddenException();
    }

    const user = await this.usersService.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException();

    return user;
  }

  @RolesAccess([Role.Admin])
  @Mutation(() => UserOutput)
  async createUser(@Args() { input }: CreateUserArgs) {
    return this.usersService.create({
      data: input,
    });
  }

  @Mutation(() => UserOutput)
  async updateUser(@CurrentUser() currentUser: User, @Args() { id, input }: UpdateUserArgs) {
    id = id || currentUser.id;

    if (!currentUser.roles.includes(Role.Admin)) {
      if (currentUser.id !== id) {
        throw new ForbiddenException();
      }

      delete input.roles;
    }

    return this.usersService.update({
      where: {
        id,
      },
      data: input,
    });
  }

  @RolesAccess([Role.Admin])
  @Mutation(() => UserOutput)
  async removeUser(@Args() { id }: RemoveUserArgs) {
    return this.usersService.remove({
      where: {
        id,
      },
    });
  }
}
