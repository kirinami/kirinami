import { Module } from '@nestjs/common';

import UserResolver from './resolvers/UserResolver';
import UsersService from './UsersService';

@Module({
  providers: [UserResolver, UsersService],
  exports: [UserResolver, UsersService],
})
export default class UsersModule {}
