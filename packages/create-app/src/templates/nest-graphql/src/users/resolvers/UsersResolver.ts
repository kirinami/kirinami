import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import JwtAccess from '@/auth/decorators/JwtAccess';
import PrismaService from '@/common/services/PrismaService';

import CreateUserArgs from '../dto/args/CreateUserArgs';
import DeleteUserArgs from '../dto/args/DeleteUserArgs';
import GetUserArgs from '../dto/args/GetUserArgs';
import GetUsersArgs from '../dto/args/GetUsersArgs';
import UpdateUserArgs from '../dto/args/UpdateUserArgs';
import UsersPaginationType from '../dto/types/UsersPaginationType';
import UserType from '../dto/types/UserType';
import UsersService from '../services/UsersService';

@JwtAccess(['Admin'])
@Resolver(() => UserType)
export default class UsersResolver {
  constructor(private readonly prismaService: PrismaService, private readonly usersService: UsersService) {}

  @Query(() => UsersPaginationType)
  async getUsers(@Args() { page, size }: GetUsersArgs): Promise<UsersPaginationType> {
    const [items, total] = await Promise.all([
      this.prismaService.user.findMany({
        orderBy: {
          id: 'desc',
        },
        skip: size * (page - 1),
        take: size,
      }),
      this.prismaService.user.count(),
    ]);

    return { items, total };
  }

  @Query(() => UserType)
  async getUser(@Args() { id }: GetUserArgs): Promise<UserType> {
    return this.usersService.findUserById(id);
  }

  @Mutation(() => UserType)
  async createUser(@Args() { input }: CreateUserArgs): Promise<UserType> {
    return this.usersService.createUser(input);
  }

  @Mutation(() => UserType)
  async updateUser(@Args() { input: { id, ...input } }: UpdateUserArgs): Promise<UserType> {
    return this.usersService.updateUser(id, input);
  }

  @Mutation(() => UserType)
  async deleteUser(@Args() { id }: DeleteUserArgs): Promise<UserType> {
    return this.usersService.deleteUser(id);
  }
}
