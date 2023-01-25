import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import JwtAccess from '@/server/auth/decorators/JwtAccess';
import RolesAccess from '@/server/auth/decorators/RolesAccess';
import PrismaService from '@/server/utils/services/PrismaService';

import CreateUserArgs from '../dto/args/CreateUserArgs';
import DeleteUserArgs from '../dto/args/DeleteUserArgs';
import GetUserArgs from '../dto/args/GetUserArgs';
import GetUsersPaginatedArgs from '../dto/args/GetUsersPaginatedArgs';
import UpdateUserArgs from '../dto/args/UpdateUserArgs';
import UserPaginatedType from '../dto/types/UserPaginatedType';
import UserType from '../dto/types/UserType';
import UsersService from '../UsersService';

@JwtAccess()
@Resolver(() => UserType)
export default class UserResolver {
  constructor(private readonly prismaService: PrismaService, private readonly usersService: UsersService) {}

  @RolesAccess(['Admin'])
  @Query(() => UserPaginatedType)
  async getUsersPaginated(@Args() { page, size }: GetUsersPaginatedArgs): Promise<UserPaginatedType> {
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

  @RolesAccess(['Admin'])
  @Query(() => UserType)
  async getUser(@Args() { id }: GetUserArgs): Promise<UserType> {
    return this.usersService.findUserById(id);
  }

  @RolesAccess(['Admin'])
  @Mutation(() => UserType)
  async createUser(@Args() { input }: CreateUserArgs): Promise<UserType> {
    return this.usersService.createUser(input);
  }

  @RolesAccess(['Admin'])
  @Mutation(() => UserType)
  async updateUser(@Args() { input: { id, ...input } }: UpdateUserArgs): Promise<UserType> {
    return this.usersService.updateUser(id, input);
  }

  @RolesAccess(['Admin'])
  @Mutation(() => UserType)
  async deleteUser(@Args() { id }: DeleteUserArgs): Promise<UserType> {
    return this.usersService.deleteUser(id);
  }
}
