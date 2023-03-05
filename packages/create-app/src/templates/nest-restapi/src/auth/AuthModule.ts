import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import UsersModule from '@/users/UsersModule';

import AuthController from './controllers/AuthController';
import AuthService from './services/AuthService';
import JwtAccessStrategy from './strategies/JwtAccessStrategy';

@Module({
  imports: [JwtModule.register({}), PassportModule, UsersModule],
  providers: [AuthService, JwtAccessStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export default class AuthModule {}
