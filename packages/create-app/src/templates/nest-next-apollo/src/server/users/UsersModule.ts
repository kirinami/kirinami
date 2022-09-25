import { Module } from '@nestjs/common';

import UserResolver from './resolvers/UserResolver';

@Module({
  providers: [UserResolver],
  exports: [UserResolver],
})
export default class UsersModule {}
