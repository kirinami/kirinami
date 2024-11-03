import { Module } from '@nestjs/common';

import { UserResolver } from './resolvers/user.resolver';
import { UsersService } from './services/users.service';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [],
  providers: [UserResolver, UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
