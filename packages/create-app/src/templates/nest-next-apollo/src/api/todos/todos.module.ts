import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@/api/users/users.module';

import { Todo } from './todo.entity';
import { TodosResolver } from './todos.resolver';
import { TodosService } from './todos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Todo,
    ]),
    forwardRef(() => UsersModule),
  ],
  providers: [TodosResolver, TodosService],
  exports: [TodosService],
})
export class TodosModule {
}
