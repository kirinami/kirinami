import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { groupBy, reduce, uniq } from 'lodash';

import { createDataLoader } from '@/api/utils/create-data-loader';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {
  }

  async findOneById(id: number, relations?: string[]) {
    if (relations && !relations.includes('todos')) throw new BadRequestException();

    return this.usersRepository.findOne({
      where: {
        id,
      },
      relations,
    });
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findOneByCredentials(email: string, password: string) {
    const user = await this.findOneByEmail(email);
    if (!user) return null;

    const match = await User.comparePassword(password, user.password);
    if (!match) return null;

    return user;
  }

  async loadOneById(id: number) {
    return createDataLoader<number, User | undefined>('users/loadOneById', async (ids) => {
      const users = await this.usersRepository.find({
        where: {
          id: In(uniq(ids)),
        },
      });

      return reduce<Record<number, User[]>, Record<number, User>>(
        groupBy(users, 'id'),
        (acc, [user], key) => ({ ...acc, [key]: user }),
        {},
      );
    }, undefined)
      .load(id);
  }

  async create(createUserDto: CreateUserDto) {
    const password = await User.hashPassword(createUserDto.password);

    return this.usersRepository.save(this.usersRepository.create({
      ...createUserDto,
      password,
    }))
      .catch((err) => {
        if (/(email)[\s\S]+(already exists)/.test(err.detail)) {
          throw new BadRequestException(['email already exists']);
        }
        return err;
      });
  }
}
