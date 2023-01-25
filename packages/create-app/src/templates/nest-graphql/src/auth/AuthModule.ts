import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import UsersModule from '@/users/UsersModule';

import AuthResolver from './resolvers/AuthResolver';
import AuthService from './services/AuthService';
import JwtAccessStrategy from './strategies/JwtAccessStrategy';

@Module({
  imports: [JwtModule.register({}), PassportModule, UsersModule],
  providers: [AuthService, AuthResolver, JwtAccessStrategy],
  exports: [AuthService, AuthResolver],
})
export default class AuthModule {}
