import { Module } from '@nestjs/common';

import CommonModule from '@/common/CommonModule';

import UsersController from './controllers/UsersController';
import UsersService from './services/UsersService';

@Module({
  imports: [CommonModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export default class UsersModule {}
