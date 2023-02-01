import { Module } from '@nestjs/common';

import CommonModule from '@/common/CommonModule';

import UsersResolver from './resolvers/UsersResolver';
import UsersService from './services/UsersService';

@Module({
  imports: [CommonModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export default class UsersModule {}
