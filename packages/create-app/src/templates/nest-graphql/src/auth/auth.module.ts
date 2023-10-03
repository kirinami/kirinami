import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { CommonModule } from '@/common/common.module';
import { UsersModule } from '@/users/users.module';

import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({}), PassportModule, CommonModule, UsersModule],
  providers: [JwtAccessStrategy, AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
