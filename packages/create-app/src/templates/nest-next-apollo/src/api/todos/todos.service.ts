import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { Todo } from './todo.entity';

@Injectable()
export class TodosService {
  constructor(@InjectRepository(Todo) private readonly todosRepository: Repository<Todo>) {
  }

  async finaAll({ page = 1, size = 10, ...options }: { page?: number, size?: number } & Pick<FindManyOptions, 'where'>) {
    const [todos, total] = await Promise.all([
      this.todosRepository.find({
        order: {
          id: 'ASC',
        },
        ...options,
        skip: Math.abs(size * (page - 1)),
        take: Math.abs(size),
      }),
      this.todosRepository.count(options),
    ]);

    return {
      todos,
      total,
    };
  }

  async findOne(options: Pick<FindOneOptions, 'where'>) {
    return this.todosRepository.findOne(options);
  }

  async create({ input }: { input: DeepPartial<Omit<Todo, 'id'>> }) {
    return this.todosRepository.save(this.todosRepository.create(input));
  }

  async update({ input, ...options }: { input: DeepPartial<Omit<Todo, 'id'>> } & Pick<FindOneOptions, 'where'>) {
    const todo = await this.findOne(options);
    if (!todo) return null;

    return this.todosRepository.save(this.todosRepository.merge(todo, input));
  }

  async remove(options: Pick<FindOneOptions, 'where'>) {
    const todo = await this.findOne(options);
    if (!todo) return null;

    await this.todosRepository.delete({
      id: todo.id,
    });

    return todo;
  }
}
