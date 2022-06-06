import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ForbiddenException } from '@nestjs/common';

import { CurrentUser } from '@/api/auth/decorators/current-user.decorator';
import { JwtAccess } from '@/api/auth/decorators/jwt-access.decorator';
import { Role, User } from '@/api/users/user.entity';
import { UsersService } from '@/api/users/users.service';

import { CreateTodoInput } from './inputs/create-todo.input';
import { UpdateTodoInput } from './inputs/update-todo.input';
import { TodosPaginationOutput } from './outputs/todos-pagination.output';
import { Todo } from './todo.entity';
import { TodosService } from './todos.service';

@JwtAccess()
@Resolver(Todo)
export class TodosResolver {
  private readonly pubSub = new PubSub();

  constructor(
    private readonly usersService: UsersService,
    private readonly todosService: TodosService,
  ) {
  }

  @Query(() => TodosPaginationOutput)
  async retrieveTodos(
    @CurrentUser() currentUser: User,
    @Args('my', { type: () => Boolean, nullable: true, defaultValue: false }) my: boolean,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
    @Args('size', { type: () => Int, nullable: true, defaultValue: 10 }) size: number,
  ) {
    return this.todosService.finaAll({
      where: {
        userId: !currentUser.roles.includes(Role.Admin) || my ? currentUser.id : undefined,
      },
      page,
      size,
    });
  }

  @Query(() => Todo)
  async retrieveTodo(@CurrentUser() currentUser: User, @Args('id', { type: () => Int }) id: number) {
    return this.todosService.findOne({
      where: {
        id,
        userId: !currentUser.roles.includes(Role.Admin) ? currentUser.id : undefined,
      },
    });
  }

  @Mutation(() => Todo)
  async createTodo(@CurrentUser() currentUser: User, @Args('input') input: CreateTodoInput) {
    if (!currentUser.roles.includes(Role.Admin)) {
      if (input.userId && currentUser.id !== input.userId) {
        throw new ForbiddenException();
      }

      input.userId = currentUser.id;
    }

    return this.todosService.create({
      input,
    });
  }

  @Mutation(() => Todo)
  async updateTodo(
    @CurrentUser() currentUser: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateTodoInput,
  ) {
    if (!currentUser.roles.includes(Role.Admin)) {
      if (input.userId && currentUser.id !== input.userId) {
        throw new ForbiddenException();
      }

      input.userId = currentUser.id;
    }

    return this.todosService.update({
      where: {
        id,
        userId: !currentUser.roles.includes(Role.Admin) ? currentUser.id : undefined,
      },
      input,
    });
  }

  @Mutation(() => Todo)
  async removeTodo(@CurrentUser() currentUser: User, @Args('id', { type: () => Int }) id: number) {
    return this.todosService.remove({
      where: {
        id,
        userId: !currentUser.roles.includes(Role.Admin) ? currentUser.id : undefined,
      },
    });
  }

  @ResolveField('user', () => User)
  async resolveUser(@Parent() parent: Todo) {
    return this.usersService.findOne({
      where: {
        id: parent.userId,
      },
    });
  }

  // @Subscription(() => Todo, { name: 'todosDeleted' })
  // async deleted() {
  //   return this.pubSub.asyncIterator('todosDeleted');
  // }
  //
  // @ResolveField('user', () => User)
  // async resolveUser(@Parent() parent: Todo) {
  //   return this.usersService.loadOneById(parent.userId);
  // }
}
