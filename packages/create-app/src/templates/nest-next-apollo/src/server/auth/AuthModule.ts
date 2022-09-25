import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import AuthResolver from './resolvers/AuthResolver';
import JwtAccessStrategy from './strategies/JwtAccessStrategy';
import AuthService from './AuthService';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [JwtAccessStrategy, AuthResolver, AuthService],
  exports: [AuthResolver, AuthService],
})
export default class AuthModule {}
