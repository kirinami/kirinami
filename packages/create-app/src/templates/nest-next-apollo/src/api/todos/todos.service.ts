import { BadRequestException, Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DeepPartial, In } from 'typeorm';
import { groupBy, uniq } from 'lodash';

import { createDataLoader } from '@/api/utils/create-data-loader';

import { Todo } from './todo.entity';
import { TodoRepository } from './todo.repository';

@Injectable()
export class TodosService {
  constructor(private readonly todoRepository: TodoRepository) {
  }

  async findOneByIdAndUserId(id: number, userId: number, relations?: string[]) {
    if (relations && !relations.includes('user')) throw new BadRequestException();

    return this.todoRepository.findOne({
      where: {
        id,
        userId,
      },
      relations,
    });
  }

  async findAllByUserId(userId: number, relations?: string[]) {
    if (relations && !relations.includes('user')) throw new BadRequestException();

    return this.todoRepository.find({
      where: {
        userId,
      },
      relations,
      order: {
        id: 'ASC',
      },
    });
  }

  async loadAllByUserId(userId: number) {
    return createDataLoader<number, Todo[]>('todos/loadAllByUserId', async (userIds) => {
      const todos = await this.todoRepository.find({
        where: {
          userId: In(uniq(userIds)),
        },
        order: {
          id: 'ASC',
        },
      });

      return groupBy(todos, 'userId');
    }, [])
      .load(userId);
  }

  async createByUserId(userId: number, partialTodo: DeepPartial<Todo>) {
    return this.todoRepository.save(this.todoRepository.create({ ...partialTodo, userId }));
  }

  async updateByIdAndUserId(id: number, userId: number, partialTodo: QueryDeepPartialEntity<Todo>) {
    return this.todoRepository.update({ id, userId }, { ...partialTodo });
  }

  async deleteByIdAndUserId(id: number, userId: number) {
    return this.todoRepository.delete({ id, userId });
  }
}
