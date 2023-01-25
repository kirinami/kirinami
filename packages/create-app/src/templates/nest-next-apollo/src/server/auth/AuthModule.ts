import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import UsersModule from '@/server/users/UsersModule';

import AuthResolver from './resolvers/AuthResolver';
import JwtAccessStrategy from './strategies/JwtAccessStrategy';

@Module({
  imports: [PassportModule, JwtModule.register({}), UsersModule],
  providers: [JwtAccessStrategy, AuthResolver],
  exports: [AuthResolver],
})
export default class AuthModule {}
