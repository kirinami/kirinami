import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DeepPartial, In, Repository } from 'typeorm';
import { groupBy, uniq } from 'lodash';

import { createDataLoader } from '@/api/utils/create-data-loader';

import { Todo } from './todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private readonly todosRepository: Repository<Todo>,
  ) {
  }

  async findOneByIdAndUserId(id: number, userId: number, relations?: string[]) {
    if (relations && !relations.includes('user')) throw new BadRequestException();

    return this.todosRepository.findOne({
      where: {
        id,
        userId,
      },
      relations,
    });
  }

  async findAllByUserId(userId: number, relations?: string[]) {
    if (relations && !relations.includes('user')) throw new BadRequestException();

    return this.todosRepository.find({
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
      const todos = await this.todosRepository.find({
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
    return this.todosRepository.save(this.todosRepository.create({ ...partialTodo, userId }));
  }

  async updateByIdAndUserId(id: number, userId: number, partialTodo: QueryDeepPartialEntity<Todo>) {
    return this.todosRepository.update({ id, userId }, { ...partialTodo });
  }

  async deleteByIdAndUserId(id: number, userId: number) {
    return this.todosRepository.delete({ id, userId });
  }
}
