import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '@/api/auth/decorators/current-user.decorator';
import { JwtAccess } from '@/api/auth/decorators/jwt-access.decorator';
import { Todo } from '@/api/todos/todo.entity';
import { TodosService } from '@/api/todos/todos.service';

import { User } from './user.entity';

@JwtAccess()
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly todosService: TodosService) {
  }

  @Query(() => User, { name: 'usersProfile' })
  async profile(@CurrentUser() user: User) {
    return user;
  }

  @ResolveField('todos', () => [Todo])
  async resolveTodos(@Parent() parent: User) {
    return this.todosService.loadAllByUserId(parent.id);
  }
}
