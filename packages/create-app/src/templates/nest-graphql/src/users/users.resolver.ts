import { Query, Resolver } from '@nestjs/graphql';

import { BearerAccess, Role } from '@/auth/decorators/bearer-access';

import { UserModel } from './models/user.model';

@Resolver()
export class UsersResolver {
  @BearerAccess([Role.Admin])
  @Query(() => [UserModel])
  users() {
    return [];
  }
}
