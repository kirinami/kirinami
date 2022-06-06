import { ForbiddenException } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Raw } from 'typeorm';

import { CurrentUser } from '@/api/auth/decorators/current-user.decorator';
import { JwtAccess } from '@/api/auth/decorators/jwt-access.decorator';
import { RolesAccess } from '@/api/auth/decorators/roles-access.decorator';

import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { UsersPaginationOutput } from './outputs/users-pagination.output';
import { Role, User } from './user.entity';
import { UsersService } from './users.service';

@JwtAccess()
@Resolver(User)
export class UsersResolver {
  private readonly pubSub = new PubSub();

  constructor(private readonly usersService: UsersService) {
  }

  @RolesAccess([Role.Admin])
  @Query(() => [User])
  async searchUsers(@Args('search', { type: () => String, nullable: true, defaultValue: 1 }) search: string) {
    if (search.length < 3) return [];

    return this.usersService.searchAll(search);
  }

  @RolesAccess([Role.Admin])
  @Query(() => UsersPaginationOutput)
  async retrieveUsers(
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
    @Args('size', { type: () => Int, nullable: true, defaultValue: 10 }) size: number,
  ) {
    return this.usersService.findAll({
      page,
      size,
    });
  }

  @Query(() => User)
  async retrieveUser(
    @CurrentUser() currentUser: User,
    @Args('id', { type: () => Int, nullable: true }) id?: number,
  ) {
    if (!currentUser.roles.includes(Role.Admin)) {
      if (id && currentUser.id !== id) {
        throw new ForbiddenException();
      }

      id = currentUser.id;
    }

    return this.usersService.findOne({
      where: {
        id,
      },
    });
  }

  @RolesAccess([Role.Admin])
  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    return this.usersService.create({
      input,
    });
  }

  @Mutation(() => User)
  async updateUser(
    @CurrentUser() currentUser: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateUserInput,
  ) {
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
      input,
    });
  }

  @RolesAccess([Role.Admin])
  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove({
      where: {
        id,
      },
    });
  }
}
