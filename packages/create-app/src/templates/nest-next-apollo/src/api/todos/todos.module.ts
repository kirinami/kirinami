import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@/api/users/users.module';

import { TodoRepository } from './todo.repository';
import { TodosController } from './todos.controller';
import { TodosResolver } from './todos.resolver';
import { TodosService } from './todos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TodoRepository,
    ]),
    forwardRef(() => UsersModule),
  ],
  providers: [TodosResolver, TodosService],
  controllers: [TodosController],
  exports: [TodosService],
})
export class TodosModule {
}
