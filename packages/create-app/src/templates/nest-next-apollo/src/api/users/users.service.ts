import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import bcrypt from 'bcryptjs';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {
  }

  async searchAll(search: string) {
    return this.usersRepository.createQueryBuilder('user')
      .where('CONCAT(user.firstName, \' \', user.lastName, \' \', user.email) ILIKE :search', {
        search: `%${search}%`,
      })
      .orderBy('user.id', 'ASC')
      .limit(10)
      .getMany();
  }

  async findAll({ page = 1, size = 10, ...options }: { page?: number, size?: number } & Pick<FindManyOptions<User>, 'where'>) {
    const [users, total] = await Promise.all([
      this.usersRepository.find({
        order: {
          id: 'ASC',
        },
        ...options,
        skip: Math.abs(size * (page - 1)),
        take: Math.abs(size),
      }),
      this.usersRepository.count(options),
    ]);

    return {
      users,
      total,
    };
  }

  async findOne(options: Pick<FindOneOptions<User>, 'where'>) {
    return this.usersRepository.findOne(options);
  }

  async create({ input }: { input: DeepPartial<Omit<User, 'id'>> & Pick<User, 'password'> }) {
    const password = await bcrypt.hash(input.password, 10);

    return this.usersRepository.save(this.usersRepository.create({ ...input, password }))
      .catch<User>((err) => {
        if (/(email)[\s\S]+(already exists)/.test(err.detail)) {
          throw new BadRequestException(['email already exists']);
        }

        return err;
      });
  }

  async update({ input, ...options }: { input: DeepPartial<Omit<User, 'id'>> } & Pick<FindOneOptions<User>, 'where'>) {
    const user = await this.findOne(options);
    if (!user) return null;

    let password;
    if (input.password) {
      password = await bcrypt.hash(input.password, 10);
    }

    return this.usersRepository.save(this.usersRepository.merge(user, { ...input, password }))
      .catch<User>((err) => {
        if (/(email)[\s\S]+(already exists)/.test(err.detail)) {
          throw new BadRequestException(['email already exists']);
        }

        return err;
      });
  }

  async remove(options: Pick<FindOneOptions<User>, 'where'>) {
    const user = await this.findOne(options);
    if (!user) return null;

    await this.usersRepository.delete({
      id: user.id,
    });

    return user;
  }
}
