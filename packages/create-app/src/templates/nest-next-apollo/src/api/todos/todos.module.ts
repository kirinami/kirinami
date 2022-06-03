import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@/api/users/users.module';

import { Todo } from './todo.entity';
import { TodosController } from './todos.controller';
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
  controllers: [TodosController],
  exports: [TodosService],
})
export class TodosModule {
}
