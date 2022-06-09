import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { type Todo, type User } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { omit } from 'lodash';

import { CurrentUser } from '@/api/auth/decorators/current-user.decorator';
import { JwtAccess } from '@/api/auth/decorators/jwt-access.decorator';
import { Role } from '@/api/users/enums/role.enum';
import { UserOutput } from '@/api/users/outputs/user.output';
import { UsersService } from '@/api/users/users.service';

import { FindAllTodosArgs } from './args/find-all-todos.args';
import { FindOneTodoArgs } from './args/find-one-todo.args';
import { CreateTodoArgs } from './args/create-todo.args';
import { UpdateTodoArgs } from './args/update-todo.args';
import { RemoveTodoArgs } from './args/remove-todo.args';
import { TodoOutput } from './outputs/todo.output';
import { TodosPaginationOutput } from './outputs/todos-pagination.output';
import { TodosService } from './todos.service';

@JwtAccess()
@Resolver(() => TodoOutput)
export class TodosResolver {
  private readonly pubSub = new PubSub();

  constructor(
    private readonly usersService: UsersService,
    private readonly todosService: TodosService,
  ) {
  }

  @Query(() => TodosPaginationOutput)
  async findAllTodos(@CurrentUser() currentUser: User, @Args() { my, page, size }: FindAllTodosArgs) {
    return this.todosService.findAll({
      where: {
        userId: !currentUser.roles.includes(Role.Admin) || my ? currentUser.id : undefined,
      },
      page,
      size,
    });
  }

  @Query(() => TodoOutput)
  async findOneTodo(@CurrentUser() currentUser: User, @Args() { id }: FindOneTodoArgs) {
    const todo = await this.todosService.findOne({
      where: {
        id,
        userId: !currentUser.roles.includes(Role.Admin) ? currentUser.id : undefined,
      },
    });

    if (!todo) throw new NotFoundException();

    return todo;
  }

  @Mutation(() => TodoOutput)
  async createTodo(@CurrentUser() currentUser: User, @Args() { input }: CreateTodoArgs) {
    const userId = input.userId || currentUser.id;

    if (!currentUser.roles.includes(Role.Admin) && currentUser.id !== userId) {
      throw new ForbiddenException();
    }

    return this.todosService.create({
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

  @Mutation(() => TodoOutput)
  async updateTodo(@CurrentUser() currentUser: User, @Args() { id, input }: UpdateTodoArgs) {
    const userId = input.userId || currentUser.id;

    if (!currentUser.roles.includes(Role.Admin) && currentUser.id !== userId) {
      throw new ForbiddenException();
    }

    return this.todosService.update({
      where: currentUser.roles.includes(Role.Admin) ? { id } : { id_userId: { id, userId: currentUser.id } },
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

  @Mutation(() => TodoOutput)
  async removeTodo(@CurrentUser() currentUser: User, @Args() { id }: RemoveTodoArgs) {
    return this.todosService.remove({
      where: currentUser.roles.includes(Role.Admin) ? { id } : { id_userId: { id, userId: currentUser.id } },
    });
  }

  @ResolveField('user', () => UserOutput)
  async resolveUser(@Parent() parent: Todo) {
    return this.usersService.findOne({
      where: {
        id: parent.userId,
      },
    });
  }
}
