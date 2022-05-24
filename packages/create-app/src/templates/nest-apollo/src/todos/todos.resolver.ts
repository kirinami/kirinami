import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAccess } from '@/auth/decorators/jwt-access.decorator';
import { User } from '@/users/user.entity';
import { UsersService } from '@/users/users.service';

import { CreateTodoInput } from './inputs/create-todo.input';
import { UpdateTodoInput } from './inputs/update-todo.input';
import { Todo } from './todo.entity';
import { TodosService } from './todos.service';

@JwtAccess()
@Resolver(() => Todo)
export class TodosResolver {
  private readonly pubSub = new PubSub();

  constructor(
    private readonly usersService: UsersService,
    private readonly todosService: TodosService,
  ) {
  }

  @Query(() => [Todo], { name: 'todosAll' })
  async retrieveAll(@CurrentUser() user: User) {
    return this.todosService.findAllByUserId(user.id);
  }

  @Query(() => Todo, { name: 'todosById' })
  async retrieveById(@CurrentUser() user: User, @Args('id') id: number) {
    return this.todosService.findOneByIdAndUserId(id, user.id);
  }

  @Mutation(() => Todo, { name: 'todosCreate' })
  async create(@CurrentUser() user: User, @Args('todo') createTodoInput: CreateTodoInput) {
    const { id } = await this.todosService.createByUserId(user.id, createTodoInput);

    const todo = await this.todosService.findOneByIdAndUserId(id, user.id);
    if (!todo) throw new NotFoundException();

    this.pubSub.publish('todosAdded', { todosAdded: todo });

    return todo;
  }

  @Mutation(() => Todo, { name: 'todosUpdate' })
  async update(@CurrentUser() user: User, @Args('id') id: number, @Args('todo') updateTodoInput: UpdateTodoInput) {
    const { affected } = await this.todosService.updateByIdAndUserId(id, user.id, updateTodoInput);
    if (affected === 0) throw new NotFoundException();

    const todo = await this.todosService.findOneByIdAndUserId(id, user.id);
    if (!todo) throw new NotFoundException();

    this.pubSub.publish('todosUpdated', { todosUpdated: todo });

    return todo;
  }

  @Mutation(() => Todo, { name: 'todosDelete' })
  async delete(@CurrentUser() user: User, @Args('id') id: number) {
    const todo = await this.todosService.findOneByIdAndUserId(id, user.id);
    if (!todo) throw new NotFoundException();

    const { affected } = await this.todosService.deleteByIdAndUserId(id, user.id);
    if (affected === 0) throw new NotFoundException();

    this.pubSub.publish('todosDeleted', { todosDeleted: todo });

    return todo;
  }

  @Subscription(() => Todo, { name: 'todosAdded' })
  async added() {
    return this.pubSub.asyncIterator('todosAdded');
  }

  @Subscription(() => Todo, { name: 'todosUpdated' })
  async updated() {
    return this.pubSub.asyncIterator('todosUpdated');
  }

  @Subscription(() => Todo, { name: 'todosDeleted' })
  async deleted() {
    return this.pubSub.asyncIterator('todosDeleted');
  }

  @ResolveField('user', () => User)
  async resolveUser(@Parent() parent: Todo) {
    return this.usersService.loadOneById(parent.userId);
  }
}
