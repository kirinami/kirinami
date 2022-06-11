import { Module } from '@nestjs/common';

import { PrismaModule } from '@/api/prisma/prisma.module';
import { UsersModule } from '@/api/users/users.module';

import { TodosResolver } from './todos.resolver';
import { TodosService } from './todos.service';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [TodosResolver, TodosService],
  exports: [TodosService],
})
export class TodosModule {
}
